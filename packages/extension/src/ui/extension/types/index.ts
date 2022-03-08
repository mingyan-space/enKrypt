import { UnwrapNestedRefs, Ref } from "vue";
import { ProviderRequestOptions, ProviderRPCRequest } from "@/types/provider";
import { InternalOnMessageResponse } from "@/types/messenger";
import type PublicKeyRing from "@/libs/keyring/public-keyring";
import { RPCRequestType } from "@enkryptcom/types";
export interface WindoPromiseType {
  PromiseResolve: Ref<(res: InternalOnMessageResponse) => void>;
  options: UnwrapNestedRefs<ProviderRequestOptions>;
  Request: Ref<ProviderRPCRequest>;
  KeyRing: PublicKeyRing;
  sendToBackground: (req: RPCRequestType) => Promise<InternalOnMessageResponse>;
}
