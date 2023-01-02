import Cookies from "js-cookie";
let id = Cookies.get("user_id");
let token = Cookies.get("token");

export const FETCH_USERS = `${process.env.api}admin/${id}/users`;

export const FETCH_QUIZZES = `${process.env.api}admin/quiz`;
export const FETCH_QUIZZES_BY_USER = `${process.env.api}admin/quiz/${token}`;

export const DELETE_QUIZZES = `${process.env.api}admin/${id}/quiz`;
export const FETCH_USER = (admin_id, user_id) =>
  `${process.env.api}admin/${admin_id}/users/${user_id}`;
export const DELETE_USERS = `${process.env.api}admin/${id}/users`;
export const DELETE_USERS_V2 = (user_id) =>
  `${process.env.api}admin/${id}/users/${user_id}`;
