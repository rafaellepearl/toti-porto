/* ------------------------------------------------------------------
   EFRAIM VIDEO — what's on the shelves.
   One tape per portfolio section. Each tape is dressed as a film genre:
     art      which cover painting to use (see covers.js):
              adventure | grindhouse | noir | sports | space | heist | arthouse
     title    the words on the cover, one array item per line
     tagline  the line on the box
     blurb    back-of-the-box text, written in the voice of the genre
     works    the real projects inside (leave link "" if there is none)
              image: "img/file.jpg" shows a picture with the work (poster / thumbnail)
              imageShape: "poster" for a tall poster, otherwise a wide picture
     cta      optional big button under the blurb: { label, href }
     colors   panel colours when the tape is opened
   The order of the tapes below is the order they sit on the shelves.
------------------------------------------------------------------- */
window.DATA = {
  owner: {
    name: "Efraim Toti",
    roles: "Directing / Writing / Editing / Producing / Photography / Videography",
    email: "efraimtoti@gmail.com",
    phone: "+62 812 1136 8646",
    tel: "+6281211368646",
    /* the video that plays on the counter TV — a Google Drive or YouTube link */
    tvLabel: "Melly: the trailer",   // the words on the light-bulb sign above the TV
    tv: "https://drive.google.com/file/d/1Z7B2I29eLfbIvg7xPiFORPBBFPgCaNG6/view?usp=sharing"
  },

  tapes: [
    {
      id: "short-film", name: "Short Film", title: ["SHORT", "FILM"], art: "adventure", genre: "Adventure",
      colors: { bg: "#f08a4b", fg: "#1b1a17", acc: "#f4c542" },
      tagline: "Two expeditions into the lost temples of memory.",
      blurb: "I bring out-of-the-box concepts to the script and decisive, assured leadership to the set. As a Writer-Director, I foster a highly collaborative environment to ensure that even the most unconventional ideas translate seamlessly to the screen.",
      works: [
        {
          title: "Segalanya Tentang Melly", year: "2023", role: "Co-Producer, Writer, Director, Editor",
          text: "A story about loss and how to deal with that loss. An experimental film using the filmmakers real audio-visual archive to craft a fictional narrative about grief, memory, and moving on. Screened at the National Gallery of Indonesia, 1 International film festival, and 5 national film festivals.",
          image: "img/poster-melly.jpg", imageShape: "poster", imageAlt: "Poster of Segalanya Tentang Melly",
          link: "https://drive.google.com/file/d/1ga_EJ53XEZ3vcpf_rZYJ8ZCwE--yi7Pk/view?usp=sharing"
        },
        {
          title: "Hello, Goodbye", year: "2025", role: "Co-Producer, Writer, Director, Editor",
          text: "The riddle of the three calls. Farrel, a man in his late 20s, phones his sister, a co-worker, and an old friend from high school. What's going on with Farrel? Follow the line and find out.",
          link: "https://drive.google.com/file/d/1buWFFBUiPgKIb047pH1h0x0RLQM2_2LL/view?usp=sharing"
        }
      ]
    },
    {
      id: "content-specialist", name: "Content Specialist", title: ["CONTENT", "SPECIALIST"], art: "sports", genre: "Sports Drama",
      colors: { bg: "#5fae7b", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "The archive was benched for years. One channel put it back in the game.",
      blurb: "My first project at ANTV is to manage the “Lensor Match” youtube channel. The data speak for itself, since then: 200.000+ subscribers, 166.357.284 views, 3.668.742 in watch time, and Rp. 174.062.709 from ads revenue.",
      works: [
        {
          title: "Lensor Match", year: "2024–2025", role: "Content Specialist, ANTV",
          text: "The first official release of the archive since it aired. Managed the channel, cut long-form and short-form videos, designed clickable YouTube thumbnails, and wrote targeted SEO copy to bring Indonesian sports history back into play.",
          image: "img/lensor-match.jpg", imageAlt: "Clickable thumbnails from the Lensor Match YouTube channel",
          link: "https://www.youtube.com/channel/UCbmn7BEQiNXFHarQniBi_aQ", linkLabel: "▶ Visit the channel"
        }
      ]
    },
    {
      id: "journalistic-video", name: "Journalist Video", title: ["JOURNALIST", "VIDEO"], art: "noir", genre: "Film Noir",
      colors: { bg: "#1b1a17", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "The city never talks. He makes it.",
      blurb: "Versatile video journalist with complete full-lifecycle production experience. Skilled in deep dive investigative research, conducting high impact on camera interviews, managing complex producing workflows, and directing cinematic videography tailored for digital platforms.",
      works: [
        /* MyCity (2023) — YouTube links play right inside the panel */
        { title: "Warga Rawajati Menanti Hak Ganti Rugi", year: "MyCity, 2023", role: "Video Journalist", text: "Case file one: the residents of Rawajati, still waiting on their compensation.", link: "https://www.youtube.com/watch?v=hIDxomO71x4", thumb: "https://i.ytimg.com/vi/hIDxomO71x4/maxresdefault.jpg" },
        { title: "TMII Revitalisasi, Harga Tiket Naik?", year: "MyCity, 2023", role: "Video Journalist", text: "Case file two: a landmark gets a facelift. Who pays at the gate?", link: "https://www.youtube.com/watch?v=r3LiTAobyFw", thumb: "https://i.ytimg.com/vi/r3LiTAobyFw/maxresdefault.jpg" },
        { title: "Sisi Lain Pemakaman di TPU Pondok Ranggon", year: "MyCity, 2023", role: "Video Journalist", text: "Case file three: the other side of the Pondok Ranggon cemetery.", link: "https://www.youtube.com/watch?v=6GSwfCcAyZ4", thumb: "https://i.ytimg.com/vi/6GSwfCcAyZ4/maxresdefault.jpg" },
        { title: "Perbedaan Makanan Organik dan Anorganik", year: "MyCity, 2023", role: "Video Journalist", text: "Case file four: organic versus non-organic food, examined.", link: "https://www.youtube.com/watch?v=soT2KIvABYc", thumb: "https://i.ytimg.com/vi/soT2KIvABYc/maxresdefault.jpg" }
      ]
    },
    {
      id: "video-essay", name: "Video Essay", title: ["VIDEO", "ESSAY"], art: "grindhouse", genre: "Grindhouse",
      colors: { bg: "#f4c542", fg: "#1b1a17", acc: "#e2452f" },
      tagline: "They said it could never be shown again!",
      blurb: "Translating deep rabbit-hole research into highly entertaining, bite-sized video essays. Basically, I read the heavy stuff so you can get the fun, educational facts in a neat little package.",
      works: [
        {
          title: "The Rise and Fall of Indonesian Exploitation Film", year: "2026", role: "Writer, Presenter",
          text: "A video essay exploring the vast history of Indonesian exploitation film — in shocking colour.",
          link: "https://drive.google.com/file/d/1AZde1kzyUMJHwG61QehhfMweX0KaRN1j/view?usp=sharing"
        }
      ]
    },
    {
      id: "livestream", name: "Livestream", title: ["LIVE", "STREAM"], art: "space", genre: "Sci-Fi",
      colors: { bg: "#3d7dc4", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "Live. Across the nation. No second take.",
      blurb: "Managed multi-input OBS encoding, switching, overlays, and live audio while troubleshooting real time signal and hardware issues under pressure to ensure zero downtime broadcasts.",
      works: [
        { title: "Pelantikan Presiden & Wapres 2024", year: "2024", role: "Livestream, ANTV", text: "The presidential and vice-presidential inauguration, live.", image: "img/ls-pelantikan.jpg", imageAlt: "Livestream thumbnail: Pelantikan Presiden & Wapres 2024", link: "" },
        { title: "TOPKIN Spesial Pemilu 2024", year: "2024", role: "Livestream, ANTV", text: "Election special, live.", image: "img/ls-topkin.jpg", imageAlt: "Livestream thumbnail: TOPKIN Spesial Pemilu 2024", link: "" },
        { title: "Sidang Isbat 2026", year: "2026", role: "Livestream, ANTV", text: "Live coverage of the Sidang Isbat.", image: "img/ls-sidang-isbat.jpg", imageAlt: "Livestream thumbnail: Sidang Isbat 2026", link: "" },
        { title: "Kangen Joget ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", image: "img/ls-kangen-joget.jpg", imageAlt: "Livestream thumbnail: Kangen Joget ANTV", link: "" },
        { title: "Grebeg Pasar ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", image: "img/ls-grebeg-pasar.jpg", imageAlt: "Livestream thumbnail: Grebeg Pasar ANTV", link: "" },
        { title: "X-School Fest ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", image: "img/ls-x-school-fest.jpg", imageAlt: "Livestream thumbnail: X-School Fest ANTV", link: "" }
      ]
    },
    {
      id: "producing-work", name: "Producing Work", title: ["PRODUCING", "WORK"], art: "heist", genre: "Heist",
      colors: { bg: "#e2452f", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "Three clients. Three jobs. One producer who gets everybody out on time.",
      blurb: "Every job needs someone who knows the plan, the crew, the budget and the exits. He's the one with the clipboard. In and out, on schedule, nobody gets hurt, the client gets the film.",
      works: [
        { title: "Lazada Logistic — Company Profile", year: "", role: "Producer", text: "Job one: the company profile.", link: "https://drive.google.com/file/d/1QUad_thLeLjoFjJqylEgQYsUIwtaJyE6/view" },
        { title: "Citra Indah City — Advertisement", year: "", role: "Producer", text: "Job two: the advertisement.", link: "https://drive.google.com/file/d/1tSymwr-iWRVTz3XypUY8sFM9CjToy-gx/view?usp=sharing" },
        { title: "Lazada Logistic — Rebranding Announcement", year: "", role: "Producer", text: "Job three: the rebrand.", link: "https://drive.google.com/file/d/1iO9XF53sN5mXeV0_EZ6QOIvowSk21Mwt/view?usp=sharing" }
      ]
    },
    {
      id: "photography", name: "Photography", title: ["photo", "graphy"], art: "arthouse", genre: "Art House",
      colors: { bg: "#f6ecd2", fg: "#1b1a17", acc: "#e2452f" },
      tagline: "Un film fixe. A film that does not move.",
      blurb: "The world through my eyes.",
      cta: { label: "◉ More on Instagram @foto.grafra", href: "https://www.instagram.com/foto.grafra/" },
      works: [],
      empty: "Prints are still in the darkroom — back on this shelf soon.",
      /* These six files are small previews taken from the old deck. Replace each file in /photos with the
         full-size original (keep the same file name), or add more lines here. caption is optional. */
      photos: [
        { src: "photos/photo-01.jpg", caption: "" }, { src: "photos/photo-02.jpg", caption: "" }, { src: "photos/photo-03.jpg", caption: "" },
        { src: "photos/photo-04.jpg", caption: "" }, { src: "photos/photo-05.jpg", caption: "" }, { src: "photos/photo-06.jpg", caption: "" }
      ]
    }
  ]
};
