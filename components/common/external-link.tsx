import { Href, Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { type ComponentProps } from "react";
import { Linking } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
};

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          // Some Android builds/emulators can fail here if there is no browser activity available.
          try {
            await openBrowserAsync(href, {
              presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
            });
          } catch (error) {
            try {
              const canOpen = await Linking.canOpenURL(href);
              if (canOpen) {
                await Linking.openURL(href);
                return;
              }
            } catch {
              // Fall through.
            }

            console.warn("Failed to open external link", href, error);
          }
        }
      }}
    />
  );
}
