import React, { useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";
import { useEffect } from "react";
import { Dialog } from "@headlessui/react";

export type PopupState = "posting" | undefined;

interface PopupProps {
  currentPopup: PopupState;
  closeThis(): void;
}

export function Popup(props: PopupProps) {
  return (
    <div className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition ease-in-out duration-150">
      {props.currentPopup == "posting" && (
        <Posting close={() => props.closeThis()} />
      )}
      <div
        className="h-screen w-screen z-40 bg-black opacity-70"
        onClick={() => props.closeThis()}
      />
      <RemoveScrollBar />
    </div>
  );
}

function Posting({ close }: { close(): void }) {
  return (
    <Dialog
      open={true}
      onClose={() => console.log("ok")}
      className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Dialog.Overlay />

      <Dialog.Title>Deactivate account</Dialog.Title>
      <Dialog.Description>
        This will permanently deactivate your account
      </Dialog.Description>

      <p>
        Are you sure you want to deactivate your account? All of your data will
        be permanently removed. This action cannot be undone.
      </p>

      <button onClick={() => console.log("ok")}>Deactivate</button>
      <button onClick={() => close()}>Cancel</button>
    </Dialog>
  );
}
