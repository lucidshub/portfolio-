import GrassField from "./components/GrassField";
import InkFlowField from "./components/InkFlowField";
import LiquidMetalField from "./components/LiquidMetalField";
import LiveImageShader from "./components/LiveImageShader";

import TopoLinesField from "./components/TopoLinesField";

/** One shader per page. Distinct organic, human-made aesthetics for each. */
export function shaderFor(page: string) {
  switch (page) {
    case "home":
      return (
        <GrassField
          background="#6898E0"
          horizon="#BDD7F2"
          bladeBase="#0B1D08"
          bladeTip="#5C9E2B"
        />
      );
    case "about":
      return (
        <InkFlowField 
          colors={["#D9A05B", "#8C4A32", "#F2C272", "#401809"]}
          background="#1A0D07"
          swirl={60}
        />
      );
    case "learning":
      return <LiveImageShader src="/cherry-blossom.jpg" />;
    case "contact":
      return (
        <InkFlowField
          colors={["#FF3366", "#FF9933", "#CC00FF"]}
          background="#050010"
          swirl={100}
          drift={40}
        />
      );
    case "projects":
      return (
        <TopoLinesField 
          colorBg="#000000" 
          colorLine="#333333" 
          speed={0.8} 
        />
      );
    default:
      return <GrassField />;
  }
}
