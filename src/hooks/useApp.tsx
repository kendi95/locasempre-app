import { AppContext } from "@/context/AppProvider";
import { useContext } from "react";

export function useApp() {
  return useContext(AppContext)
}