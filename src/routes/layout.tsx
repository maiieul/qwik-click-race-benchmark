import {
  $,
  component$,
  Slot,
  sync$,
  useOnDocument,
  useStyles$,
} from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import styles from "./styles.css?inline";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  // Prevent right-click globally
  useOnDocument(
    "contextmenu",
    sync$((event: MouseEvent) => {
      event.preventDefault();
    })
  );
  useStyles$(styles);
  return (
    <>
      <main onContextMenu$={(e) => e.preventDefault()}>
        <Slot />
      </main>
    </>
  );
});
