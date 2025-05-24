declare module "expo-router" {
  type RouteNames =
    | "/"
    | "/auth/login"
    | "/auth/register"
    | "/home"
    | "/tabs"
    | "/tabs/"
    | "/tabs/index"
    | "/tabs/schedule"
    | "/tabs/progress"
    | "/tabs/profile"
    | "/auth/login"
    | "/auth/register"
    | "/profile/personal-info"
    | "/profile/preferences"
    | "/profile/payment"
    | "/profile/notifications"
    | "/profile/support"
    | "/profile/edit"
    | "/schedule"
    | "/booking/new"
    | "/booking/confirmation"
    | "/app/booking/confirmation"
    | "/modal"
    | "/error-boundary"
    | "/progress"
    | "/lesson/[id]";

  export type RouteParams = {
    "/booking/confirmation": { success: string };
    "/app/booking/confirmation": { success: string };
    "/lesson/[id]": { id: string };
  };

  type RouteObject = {
    pathname: RouteNames;
    params?: RouteParams[RouteNames];
  };

  export function useRouter(): {
    push: (
      route: RouteNames | RouteObject,
      params?: RouteParams[RouteNames],
    ) => void;
    replace: (
      route: RouteNames | RouteObject,
      params?: RouteParams[RouteNames],
    ) => void;
    back: () => void;
  };

  export type LinkProps = {
    href: RouteNames | RouteObject;
    style?: any;
    children?: React.ReactNode;
  };

  export const Link: React.FC<LinkProps>;
}
