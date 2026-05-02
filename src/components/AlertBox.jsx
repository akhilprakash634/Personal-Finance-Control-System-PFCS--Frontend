import { AlertTriangle } from "lucide-react";

export default function AlertBox({ message }) {
  return (
    <div className="alert alert-warning">
      <AlertTriangle size={20} />
      {message}
    </div>
  );
}
