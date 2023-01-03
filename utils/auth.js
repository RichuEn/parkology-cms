import { Component } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import nextCookie from "next-cookies";

function login(token, user_id, user_name = "") {
  Cookies.set("token", token, { path: "/" });
  
  Cookies.set("user_id", user_id, { path: "/" });
  Cookies.set("user_name", user_name, { path: "/" });
  localStorage.setItem("user_id", user_id);

  // check if there is a redirect stroage
  if (sessionStorage.getItem("pageToRedirect") !== null) {
    Router.push(sessionStorage.getItem("pageToRedirect"));
    sessionStorage.removeItem("pageToRedirect");
    return;
  }

  Router.push("/");
}

function logout() {
  Cookies.remove("token");
  Cookies.remove("user_id");
  Cookies.remove("user_name");

  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
}

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

function withAuthSync(WrappedComponent) {
  return class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const { token, user_id } = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token, user_id };
    }

    constructor(props) {
      super(props);
      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        Router.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

function auth(ctx) {
  const { token } = nextCookie(ctx);
  const { user_id } = nextCookie(ctx);
  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  if (ctx.req)
    if (!token || !user_id) {
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    }

  // We already checked for server. This should only happen on client.
  if (!token || !user_id) {
    Router.push("/login");
  }

  return { token, user_id };
}

export { login, logout, withAuthSync, auth };
