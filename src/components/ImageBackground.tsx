export default function ImageBackground({ src }: { src: string }) {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh", overflow: "hidden", background: "#000" }}>
            <div 
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.7) contrast(1.1)",
                }}
            />
        </div>
    )
}
