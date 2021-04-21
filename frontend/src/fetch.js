import unfetch from 'isomorphic-unfetch';

const { SNOWPACK_PUBLIC_API_URL } = import.meta.env;

export default async function fetch(path, { body, ...options } = {}) {
  const res = await unfetch(`${SNOWPACK_PUBLIC_API_URL}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const { data, error } = await res.json();
  if (error) {
    throw new Error(error.message);
  }
  return { data };
}
