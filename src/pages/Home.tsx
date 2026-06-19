
import LoginModal from "../components/LoginModal";
import { checkHome } from "../services/api";

function Home() {
  const call = async () => {
    try {
      const response = await checkHome();
      console.log("API check response:", response);
    } catch (error) {
      console.error("API check failed:", error);
    }
  };
  

  return <div className="text-black ">Home
  <button onClick={call}>
    Check API
  </button>
  <LoginModal/>
  </div>;
}

export default Home;
