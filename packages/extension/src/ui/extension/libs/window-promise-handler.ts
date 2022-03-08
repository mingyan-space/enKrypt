import { onMounted, reactive, ref, Ref, UnwrapNestedRefs } from "vue";
import { newWindowOnMessageFromBackground } from "@/libs/messenger/extension";
import {
  ProviderRPCRequest,
  ProviderRequestOptions,
  ProviderName,
} from "@/types/provider";
import { Destination, InternalOnMessageResponse } from "@/types/messenger";
import PublicKeyRing from "@/libs/keyring/public-keyring";
import type { WindoPromiseType } from "../types";
import { getCustomError } from "@/libs/error";
import sendToBackground from "@/libs/utils/send-to-background";
export default (): WindoPromiseType => {
  const options: UnwrapNestedRefs<ProviderRequestOptions> = reactive({
    url: "",
    domain: "",
    faviconURL: "",
    title: "",
  });
  const PromiseResolve: Ref<(res: InternalOnMessageResponse) => void> = ref(
    () => {
      throw "window-promise-handler: not implemented";
    }
  );
  const Request: Ref<ProviderRPCRequest> = ref({ method: "", value: "" });
  const KeyRing: PublicKeyRing = new PublicKeyRing();

  onMounted(() => {
    newWindowOnMessageFromBackground(
      (message): Promise<InternalOnMessageResponse> => {
        if (
          message.sender.context !== Destination.background ||
          message.provider !== ProviderName.enkrypt
        ) {
          return Promise.resolve({
            error: getCustomError(
              "window-promise-handler: invalid message sender"
            ),
          });
        }
        const RPCRequest = JSON.parse(message.message) as ProviderRPCRequest;
        options.domain = RPCRequest.options?.domain as string;
        options.url = RPCRequest.options?.url as string;
        options.faviconURL = RPCRequest.options?.faviconURL as string;
        options.title = RPCRequest.options?.title as string;
        Request.value = RPCRequest;
        return new Promise((resolve) => {
          PromiseResolve.value = resolve;
        });
      }
    );
  });
  return {
    PromiseResolve,
    options,
    Request,
    KeyRing,
    sendToBackground,
  };
};
