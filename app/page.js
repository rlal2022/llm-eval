import Benchmarks from "./components/Benchmarks";
import Chat from "./components/Chat";
import { LLMProvider } from "./context/LLMContext";

export default function Home() {
  return (
    <LLMProvider>
      <Chat />
      <Benchmarks />
    </LLMProvider>
  );
}
