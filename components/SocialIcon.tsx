/**
 * Instagram and WhatsApp marks, drawn as inline SVG.
 *
 * Deliberately not PNGs: these sit on a dark ground at small sizes,
 * where a raster mark shows its edges on a retina phone and needs a
 * second file per icon over the network. Drawn, they stay sharp at any
 * size, inherit the text colour so hover states come free, and cost no
 * request. To use official brand PNGs instead, drop them in
 * public/images/ and swap the <svg> for an <img> — the layout does not
 * change.
 */
export default function SocialIcon({ name }: { name: "instagram" | "whatsapp" }) {
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.83c2.16 0 4.19.84 5.71 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.08-8.09 8.08a8.2 8.2 0 0 1-4.1-1.12l-.29-.17-3.05.8.81-2.98-.19-.31a8.05 8.05 0 0 1-1.24-4.3c0-4.46 3.63-8.09 8.07-8.09Zm-2.5 4.06c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.18.86 2.32.98 2.48.12.16 1.68 2.65 4.13 3.6 2.04.79 2.45.63 2.9.59.44-.04 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.31-.73-1.79-.19-.46-.39-.4-.53-.41h-.46Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}
