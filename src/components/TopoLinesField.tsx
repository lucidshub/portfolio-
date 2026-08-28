"use client"
import * as React from "react"
import { useEffect, useRef } from "react"

const QUAD_VS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const TOPO_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uColorBg;
uniform vec3 uColorLine;

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
        p = p * 2.0 + vec2(3.1, 1.7);
        a *= 0.5;
    }
    return s;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    uv.x *= uRes.x / uRes.y; 
    
    // Base coordinates, animated slowly over time
    vec2 p = uv * 3.0 + vec2(uTime * 0.02, uTime * 0.015);
    
    // Add some domain warping for organic, topographical shape
    vec2 q = vec2(fbm(p), fbm(p + vec2(5.2,1.3)));
    float n = fbm(p + 2.0 * q);
    
    // Calculate topographical lines by taking the fractional part 
    // multiplied by a high frequency (like a sine wave, but with fract)
    float frequency = 8.0; // Number of lines
    float lines = fract(n * frequency);
    
    // Thin line width using tight smoothstep
    float lineThickness = 0.03;
    float line = smoothstep(0.0, lineThickness, lines) - smoothstep(lineThickness, lineThickness * 2.0, lines);
    
    // Mix the background color with the line color
    vec3 col = mix(uColorBg, uColorLine, line);
    
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

export default function TopoLinesField({
    colorBg = "#000000",
    colorLine = "#ffffff",
    speed = 1.0,
}: {
    colorBg?: string
    colorLine?: string
    speed?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const gl = canvas.getContext("webgl")
        if (!gl) return

        const vs = compile(gl, gl.VERTEX_SHADER, QUAD_VS)
        const fs = compile(gl, gl.FRAGMENT_SHADER, TOPO_FS)
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
        const uColorBg = gl.getUniformLocation(prog, "uColorBg")
        const uColorLine = gl.getUniformLocation(prog, "uColorLine")

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

            const cBg = parseCol(colorBg)
            const cLine = parseCol(colorLine)

            gl.uniform2f(uRes, w, h)
            gl.uniform1f(uTime, t)
            gl.uniform3f(uColorBg, cBg[0], cBg[1], cBg[2])
            gl.uniform3f(uColorLine, cLine[0], cLine[1], cLine[2])

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            raf = requestAnimationFrame(render)
        }

        raf = requestAnimationFrame(render)
        return () => cancelAnimationFrame(raf)
    }, [colorBg, colorLine, speed])

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh", overflow: "hidden", background: colorBg }}>
            <canvas 
                ref={canvasRef} 
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} 
            />
        </div>
    )
}
