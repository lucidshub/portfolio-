"use client";
import * as React from "react";
import { useEffect, useRef } from "react";

const QUAD_VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { 
    v_uv = a_pos * 0.5 + 0.5;
    // Flip Y for WebGL texture coords
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_pos, 0.0, 1.0); 
}
`;

const IMAGE_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uTex;
varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    
    // Add subtle wave distortion to make it a "live shader"
    float wave = sin(uv.y * 10.0 + uTime * 2.0) * 0.005;
    wave += cos(uv.x * 15.0 + uTime * 1.5) * 0.005;
    
    vec2 distortedUV = uv + vec2(wave, wave);
    
    // Sample texture
    vec4 texColor = texture2D(uTex, distortedUV);
    
    // Add subtle brightness pulsation
    float pulse = 1.0 + sin(uTime * 3.0) * 0.05;
    texColor.rgb *= pulse;
    
    gl_FragColor = texColor;
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
    }
    return sh;
}

export default function LiveImageShader({ src }: { src: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext("webgl");
        if (!gl) return;

        const vs = compile(gl, gl.VERTEX_SHADER, QUAD_VS);
        const fs = compile(gl, gl.FRAGMENT_SHADER, IMAGE_FS);
        if (!vs || !fs) return;

        const prog = gl.createProgram();
        if (!prog) return;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const pos = gl.getAttribLocation(prog, "a_pos");
        const uRes = gl.getUniformLocation(prog, "uRes");
        const uTime = gl.getUniformLocation(prog, "uTime");
        const uTex = gl.getUniformLocation(prog, "uTex");

        const quadBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        // Load texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Put a single pixel as a placeholder until image loads
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        };
        img.src = src;

        let raf = 0;
        let start = performance.now();

        const render = (now: number) => {
            const w = canvas.clientWidth || window.innerWidth;
            const h = canvas.clientHeight || window.innerHeight;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }

            const t = (now - start) / 1000;

            gl.uniform2f(uRes, w, h);
            gl.uniform1f(uTime, t);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(uTex, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);
        return () => cancelAnimationFrame(raf);
    }, [src]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh", overflow: "hidden", background: "#000" }}>
            <canvas 
                ref={canvasRef} 
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} 
            />
            {/* Add an overlay to match the dimming the original ImageBackground had (optional, helps text readability) */}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", pointerEvents: "none" }} />
        </div>
    );
}
