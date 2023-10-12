import { writable } from "svelte/store";
import { browser } from "$app/environment";

let initialUser = { name: null, email: null, userId: null };

if (browser) {
  // use localStorage only if the code is running in the browser
  initialUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : initialUser;
}

export const user = writable(initialUser);

user.subscribe((value) => {
  if (browser) {
    // use localStorage only if the code is running in the browser
    localStorage.setItem("user", JSON.stringify(value));
  }
});
