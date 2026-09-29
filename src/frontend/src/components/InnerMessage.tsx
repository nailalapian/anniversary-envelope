import { MessagePhotoSection } from "@/components/MessagePhotoSection";

interface InnerMessageProps {
  onClose: () => void;
}

/**
 * The Message gift: a long, handwritten love letter on the full-bleed velvet
 * burgundy stage. A small script title sits at the top, the letter body runs in
 * warm white handwriting with generous line spacing, the photo keepsake closes
 * the letter, and a quiet underlined Back link ends the page.
 */
export function InnerMessage({ onClose }: InnerMessageProps) {
  return (
    <section
      data-ocid="letter.card"
      className="animate-fade-rise flex w-full flex-col items-center"
    >
      <p
        data-ocid="letter.title"
        className="text-glow text-center font-display text-2xl italic leading-tight text-foreground sm:text-3xl"
      >
        Selamat hari jadi hubungan kita, sayang.
      </p>

      <div
        aria-hidden="true"
        className="my-7 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent sm:my-9"
      />

      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center sm:gap-7">
        <p className="font-hand text-xl leading-[1.9] text-foreground/95 sm:text-2xl sm:leading-[2]">
          Terima kasih karena menjadi orangku, sapaan favoritku, dan perpisahan
          tersulitku. Terima kasih karena telah mengisi hidupku dengan cinta,
          kebahagiaan, dan kenangan indah yang tak terhitung. Aku sangat
          beruntung bisa menyebutmu milikku.
        </p>

        <p className="font-hand text-xl leading-[1.9] text-foreground/95 sm:text-2xl sm:leading-[2]">
          Selamat hari jadi hubungan kita, sayang. Untuk semua kenangan yang
          telah kita buat, semua pelajaran yang telah kita pelajari, dan semua
          momen indah yang masih menanti kita di masa depan. Aku mencintaimu
          lebih dari yang bisa dijelaskan kata-kata, dan aku akan terus
          memilihmu hari ini, besok, dan setiap hari setelahnya. ❤️
        </p>

        <p className="font-hand text-xl leading-[1.9] text-foreground/95 sm:text-2xl sm:leading-[2]">
          Kamu adalah ketenanganku, tempat pulangku yang aman, sahabat
          terbaikku, dan orang yang membuat hari-hari biasa terasa luar biasa.
          Setiap kali hidup terasa berat, kamu adalah orang yang ingin aku tuju.
          Kehadiranmu saja sudah memberiku kedamaian, dan cintamu memberiku
          kekuatan dengan cara yang mungkin tak pernah sepenuhnya kamu sadari.
        </p>

        <MessagePhotoSection />

        <p className="font-hand text-xl leading-[1.9] text-foreground/95 sm:text-2xl sm:leading-[2]">
          Aku mencintai hal-hal kecil tentangmu — caramu membuatku tersenyum
          tanpa berusaha, caramu mendengarkanku, caramu peduli, dan caramu
          membuatku merasa dicintai bahkan dari kejauhan. Setiap kenangan yang
          kita ciptakan bersama adalah sesuatu yang sangat kuhargai, dan aku tak
          sabar membuat lebih banyak lagi bersamamu.
        </p>

        <p className="font-hand text-xl leading-[1.9] text-foreground/95 sm:text-2xl sm:leading-[2]">
          Apa pun tantangan yang datang, aku berharap kita terus saling memilih,
          terus berkomunikasi, terus bertumbuh, dan terus saling mencintai
          dengan ketulusan yang sama seperti yang menyatukan kita. Aku tahu masa
          depan tidak akan selalu mudah, tapi memilikimu di sisiku membuatku
          percaya bahwa kita bisa melewati apa pun.
        </p>
      </div>

      <button
        type="button"
        data-ocid="letter.back_button"
        onClick={onClose}
        className="mt-12 rounded-full px-4 py-2 font-body text-sm font-medium text-foreground underline decoration-foreground/50 decoration-1 underline-offset-4 transition-smooth hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-14"
      >
        Back
      </button>
    </section>
  );
}
