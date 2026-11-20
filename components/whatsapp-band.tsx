import { WhatsappIcon } from "@/components/icons";
import { whatsappBand } from "@/lib/content";
import { openingHoursLine, whatsappLink } from "@/lib/site";

export function WhatsappBand() {
  return (
    <section className="whatsapp-section" aria-labelledby="whatsapp-band-title">
      <div className="container">
        <div className="whatsapp-band">
          <span className="icon-circle icon-circle-white" aria-hidden="true"><WhatsappIcon size={24} /></span>
          <div className="whatsapp-band-copy">
            <h2 id="whatsapp-band-title">{whatsappBand.title}</h2>
            <p>{whatsappBand.text}</p>
          </div>
          <div className="whatsapp-band-action">
            <a href={whatsappLink(whatsappBand.message)} className="button button-dark" target="_blank" rel="noopener noreferrer">
              <WhatsappIcon size={18} /> {whatsappBand.button}
            </a>
            <span>{openingHoursLine}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
