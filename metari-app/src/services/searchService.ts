import { axiosConnection } from "./axiosConnection";

export async function search(word: any): Promise<any> {
  const { data } = await axiosConnection.get<any>("/search", { params: { search: word } });

  return data;
}