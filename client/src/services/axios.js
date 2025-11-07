import { API_BASE } from "../api/api.js";
import axios from "axios";

export const regesterCollegeSideApi = axios.create({
  baseURL: `${API_BASE}/college`,
});

export const loginOrBaseApi = axios.create({
  baseURL: `${API_BASE}`,
});

export const regesterStudentSideApi = axios.create({
  baseURL: `${API_BASE}/student`,
});
