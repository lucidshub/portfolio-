"use client"
import * as React from "react"
import { useEffect, useRef } from "react"

const QUAD_VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const LIQUID_METAL_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.56);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        s += a * noise(p);
        p = p * 2.1 + vec2(3.1, 1.7);
        a *= 0.5;
    }
    return s;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    uv.x *= uRes.x / uRes.y; 
    
    vec2 p = uv * 3.0; 
    float t = uTime * 0.2;
    
    vec2 q = vec2(fbm(p + vec2(0.0,0.0) + t),
                  fbm(p + vec2(5.2,1.3) - t));
                  
    vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7,9.2) + t*1.2),
                  fbm(p + 4.0*q + vec2(8.3,2.8) - t*1.1));
                  
    float f = fbm(p + 5.0*r);
    
    float eps = 0.01;
    float h = f;
    float hx = fbm(p + vec2(eps, 0.0) + 5.0*r);
    float hy = fbm(p + vec2(0.0, eps) + 5.0*r);
    
    vec3 normal = normalize(vec3(hx - h, hy - h, eps * 0.5));
    
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 ref = reflect(-viewDir, normal);
    
    float spec = pow(max(dot(ref, lightDir), 0.0), 16.0);
    float spec2 = pow(max(dot(ref, normalize(vec3(-1.0, 0.5, 1.0))), 0.0), 32.0);
    
    float env = smoothstep(0.0, 1.0, max(0.0, dot(normal, vec3(0.0, 1.0, 0.2))));
    float env2 = smoothstep(0.0, 1.0, max(0.0, dot(normal, vec3(0.0, -1.0, 0.2))));
    
    vec3 col = mix(uColor1, uColor2, env);
    col = mix(col, uColor1 * 0.5, env2);
    col += spec * 1.5 + spec2 * 0.8;
    
    col = smoothstep(0.0, 1.0, col);
    gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const sh = gl.createShader(type)
    if (!sh) return null
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(sh))
        gl.deleteShader(sh)
        return null
    }
    return sh
}

export default function LiquidMetalField({
    color1 = "#ffffff",
    color2 = "#a0a0a0",
    speed = 1.0,
}: {
    color1?: string
    color2?: string
    speed?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const gl = canvas.getContext("webgl")
        if (!gl) return

        const vs = compile(gl, gl.VERTEX_SHADER, QUAD_VS)
        const fs = compile(gl, gl.FRAGMENT_SHADER, LIQUID_METAL_FS)
        if (!vs || !fs) return

        const prog = gl.createProgram()
        if (!prog) return
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        gl.useProgram(prog)

        const pos = gl.getAttribLocation(prog, "a_pos")
        const uRes = gl.getUniformLocation(prog, "uRes")
        const uTime = gl.getUniformLocation(prog, "uTime")
        const uColor1 = gl.getUniformLocation(prog, "uColor1")
        const uColor2 = gl.getUniformLocation(prog, "uColor2")

        const quadBuf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
        gl.enableVertexAttribArray(pos)
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

        const parseCol = (hex: string) => {
            const c = hex.replace("#", "")
            return [
                parseInt(c.substring(0, 2), 16) / 255,
                parseInt(c.substring(2, 4), 16) / 255,
                parseInt(c.substring(4, 6), 16) / 255
            ]
        }

        let raf = 0
        let start = performance.now()

        const render = (now: number) => {
            const w = canvas.clientWidth || window.innerWidth
            const h = canvas.clientHeight || window.innerHeight
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w
                canvas.height = h
                gl.viewport(0, 0, w, h)
            }

            const t = ((now - start) / 1000) * speed

            const c1 = parseCol(color1)
            const c2 = parseCol(color2)

            gl.uniform2f(uRes, w, h)
            gl.uniform1f(uTime, t)
            gl.uniform3f(uColor1, c1[0], c1[1], c1[2])
            gl.uniform3f(uColor2, c2[0], c2[1], c2[2])

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            raf = requestAnimationFrame(render)
        }

        raf = requestAnimationFrame(render)
        return () => cancelAnimationFrame(raf)
    }, [color1, color2, speed])

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh", overflow: "hidden", background: "#000" }}>
            <canvas 
                ref={canvasRef} 
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} 
            />
        </div>
    )
}
