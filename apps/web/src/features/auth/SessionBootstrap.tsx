import { useAuthSession } from "./hooks";

export default function SessionBootstrap() {
  useAuthSession();
  return null;
}
