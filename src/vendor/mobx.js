import { observable } from "mobx";
import { create, persist } from "mobx-persist";
import { config as storeConfig } from "~/stores";

// No arguments (arguments are where to store like localForage.)
export const hydrate = create();

export function rehydrate(
  config = storeConfig,
  onHydrate = () => {
    console.log("Stores: All stores hydrated.");
  }
) {
  const promises = Object.keys(config.stores).map(k => {
    if (config.persist.includes(k)) {
      console.log("Stores: Rehydrating", k, config.stores[k]);
      return hydrate(k, config.stores[k]);
    }
  });

  if (promises.length > 0) {
    Promise.all(promises).then(onHydrate);
  }
}
