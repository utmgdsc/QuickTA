import { CircularProgress } from "@mui/material";

const LoadingScreen = () => {
    return (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <div style={{ minHeight: "30vh" }} className="d-flex align-items-center justify-content-center">
          <CircularProgress />
        </div>
      </div>
    );
}
export default LoadingScreen;