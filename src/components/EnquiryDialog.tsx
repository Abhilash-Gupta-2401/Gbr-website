"use client";

import { useRef, type FormEvent } from "react";
import { Send, X } from "lucide-react";

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-ink/40 focus:ring-2 focus:ring-ink/10";

export function EnquiryDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");
    const subject = "Product enquiry";
    const body = [
      `Full Name: ${name}`,
      `Phone Number: ${phone}`,
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:gbrhatcheries@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brand hover:text-white"
      >
        Get in touch
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="enquiry-title"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="m-auto max-h-[min(92dvh,760px)] w-[min(640px,calc(100%-2rem))] max-w-none overflow-y-auto rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/70"
      >
        <div className="relative p-5 sm:p-7">
          <button
            type="button"
            aria-label="Close enquiry form"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line text-ink/75 transition hover:bg-soft hover:text-ink sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 id="enquiry-title" className="mt-3 pr-10 text-[26px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">
            LET&apos;S START YOUR PROJECT TODAY
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink/70 sm:text-[16px]">
            Fill in your details and our team will get back to you with current availability and pricing — or call us directly for an instant response.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-x-4 gap-y-3 sm:grid-cols-2">
            <label className="text-[13px] text-ink/85">
              Full Name
              <input className={inputClassName} name="name" autoComplete="name" placeholder="Your name" required />
            </label>
            <label className="text-[13px] text-ink/85">
              Phone Number
              <input className={inputClassName} name="phone" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit mobile number" title="Enter a 10-digit mobile number" required />
            </label>
            <label className="text-[13px] text-ink/85 sm:col-span-2">
              Message
              <textarea className={`${inputClassName} min-h-20 resize-y`} name="message" placeholder="Any specific requirements, delivery timeline, etc." />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-brand/90 sm:col-span-2">
              <Send className="h-4 w-4" />
              Send Enquiry
            </button>
            <p className="text-center text-[12px] text-ink/50 sm:col-span-2">
              Your email app will open with these details ready to send.
            </p>
          </form>
        </div>
      </dialog>
    </>
  );
}
