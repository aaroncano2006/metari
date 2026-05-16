import { axiosConnection } from "./axiosConnection";

export async function search(word: any): Promise<any> {
  const { data } = await axiosConnection.get<any>("/search", word);

  return data;
}