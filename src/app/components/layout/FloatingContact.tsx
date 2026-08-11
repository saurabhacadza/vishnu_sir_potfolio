'use client';

import Image from 'next/image';

export default function FloatingContact() {
  const mobileNumber = '9096139645';
  const displayNumber = `+91 ${mobileNumber}`;
  const whatsappHref = `https://wa.me/91${mobileNumber}`;
  const callHref = `tel:+91${mobileNumber}`;

  return (
    <div className="floating-contact">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="floating-contact__bubble"
      >
        <Image
          src="/images/whatsapp_icon.png"
          alt="WhatsApp"
          width={36}
          height={36}
          priority
        />
        <span className="floating-contact__label">WhatsApp {displayNumber}</span>
      </a>
      <a
        href={callHref}
        aria-label="Call Vidya Bhumi"
        className="floating-contact__bubble"
      >
        <Image
          src="/images/phone_icon.png"
          alt="Phone"
          width={36}
          height={36}
          priority
        />
        <span className="floating-contact__label floating-contact__label--call">Call Us</span>
      </a>
      <a href={callHref} className="floating-contact__number" aria-label={`Call ${displayNumber}`}>
        {displayNumber}
      </a>
    </div>
  );
}
