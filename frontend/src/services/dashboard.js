import api from "./api";

export const getDashboard = async () => (await api.get("/dashboard/")).data;
export const getReports = async (params = {}) => (await api.get("/reports/", { params })).data;

async function downloadFile(path, params, filename) {
  const response = await api.get(path, { params, responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportCSV = (params = {}) => downloadFile("/reports/export/csv/", params, "report.csv");
export const exportExcel = (params = {}) => downloadFile("/reports/export/excel/", params, "report.xlsx");
