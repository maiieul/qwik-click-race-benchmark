import {
  $,
  component$,
  Slot,
  sync$,
  useOnDocument,
  useStyles$,
} from "@qwik.dev/core";
import { routeLoader$ } from "@qwik.dev/router";

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
