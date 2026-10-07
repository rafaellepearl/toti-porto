/* ------------------------------------------------------------------
   TOTI VIDEO — what's on the shelves.
   One tape per portfolio section. Each tape is dressed as a film genre:
     art      which cover painting to use (see covers.js):
              adventure | grindhouse | noir | sports | space | heist | arthouse
     title    the words on the cover, one array item per line
     tagline  the line on the box
     blurb    back-of-the-box text, written in the voice of the genre
     works    the real projects inside (leave link "" if there is none)
     colors   panel colours when the tape is opened
------------------------------------------------------------------- */
window.DATA = {
  owner: {
    name: "Efraim Toti",
    roles: "Directing / Writing / Editing / Producing / Photography / Videography",
    email: "efraimtoti@gmail.com",
    phone: "+62 812 1136 8646",
    tel: "+6281211368646"
  },

  tapes: [
    {
      id: "short-film", name: "Short Film", title: ["SHORT", "FILM"], art: "adventure", genre: "Adventure",
      colors: { bg: "#f08a4b", fg: "#1b1a17", acc: "#f4c542" },
      tagline: "Two expeditions into the lost temples of memory.",
      blurb: "Somewhere past the last marked reel on the map, one filmmaker went digging for the things most people leave buried. No whip, no hat — just a camera, an edit suite, and a bad habit of opening doors marked DO NOT OPEN. He came back with two short films.",
      works: [
        {
          title: "All About Melly", year: "2023", role: "Co-Producer, Writer, Director, Editor",
          text: "The archive raid. Armed only with his own real audio-visual archive, the filmmaker unearths a fictional story about grief, memory, and moving on. This one really does belong in a museum: it screened at the National Gallery of Indonesia, 1 international film festival and 5 national film festivals.",
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
      id: "video-essay", name: "Video Essay", title: ["VIDEO", "ESSAY"], art: "grindhouse", genre: "Grindhouse",
      colors: { bg: "#f4c542", fg: "#1b1a17", acc: "#e2452f" },
      tagline: "They said it could never be shown again!",
      blurb: "SEE the rise! SHUDDER at the fall! One man walks alone into the darkest back room of the video store and comes out with the whole lurid history. Not for the faint of heart. No one admitted during the last ten minutes.",
      works: [
        {
          title: "The Rise and Fall of Indonesian Exploitation Film", year: "2026", role: "Writer, Presenter",
          text: "A video essay exploring the vast history of Indonesian exploitation film — in shocking colour.",
          link: "https://drive.google.com/file/d/1AZde1kzyUMJHwG61QehhfMweX0KaRN1j/view?usp=sharing"
        }
      ]
    },
    {
      id: "journalistic-video", name: "Journalistic Video", title: ["JOURNALISTIC", "VIDEO"], art: "noir", genre: "Film Noir",
      colors: { bg: "#1b1a17", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "The city never talks. He makes it.",
      blurb: "The story walked in at midnight, wanting to stay hidden. They always do. So he worked the case the long way round: deep-dive investigative research, on-camera interviews that land, a producing workflow with more moving parts than a getaway, and cinematic videography cut for digital platforms. One video journalist. Start to finish.",
      works: [
        /* MyCity (2023) — paste each episode's YouTube link into link: "" and it plays right inside the panel */
        { title: "Warga Rawajati Menanti Hak Ganti Rugi", year: "MyCity, 2023", role: "Video Journalist", text: "Case file one: the residents of Rawajati, still waiting on their compensation.", link: "" },
        { title: "TMII Revitalisasi, Harga Tiket Naik?", year: "MyCity, 2023", role: "Video Journalist", text: "Case file two: a landmark gets a facelift. Who pays at the gate?", link: "" },
        { title: "Sisi Lain Pemakaman di TPU Pondok Ranggon", year: "MyCity, 2023", role: "Video Journalist", text: "Case file three: the other side of the Pondok Ranggon cemetery.", link: "" },
        { title: "Perbedaan Makanan Organik dan Anorganik", year: "MyCity, 2023", role: "Video Journalist", text: "Case file four: organic versus non-organic food, examined.", link: "" }
      ]
    },
    {
      id: "content-specialist", name: "Content Specialist", title: ["CONTENT", "SPECIALIST"], art: "sports", genre: "Sports Drama",
      colors: { bg: "#5fae7b", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "The archive was benched for years. One channel put it back in the game.",
      blurb: "Nobody had seen these matches since the night they aired. Classic Indonesian football, 1994 to 2015, sitting on the bench gathering dust. Then a rookie at ANTV got handed his first project, and the comeback was on.",
      works: [
        {
          title: "Lensor Match", year: "2024–2025", role: "Content Specialist, ANTV",
          text: "The first official release of the archive since it aired. Managed the channel, cut long-form and short-form videos, designed clickable YouTube thumbnails, and wrote targeted SEO copy to bring Indonesian sports history back into play.",
          link: "https://www.youtube.com/channel/UCbmn7BEQiNXFHarQniBi_aQ", linkLabel: "▶ Visit the channel"
        }
      ]
    },
    {
      id: "livestream", name: "Livestream", title: ["LIVE", "STREAM"], art: "space", genre: "Sci-Fi",
      colors: { bg: "#3d7dc4", fg: "#f6ecd2", acc: "#f4c542" },
      tagline: "Live. Across the nation. No second take.",
      blurb: "Mission control has one rule: when the red light comes on, there is no going back. Six transmissions, beamed out in real time for ANTV. All systems go.",
      works: [
        { title: "Pelantikan Presiden & Wapres 2024", year: "2024", role: "Livestream, ANTV", text: "The presidential and vice-presidential inauguration, live.", link: "" },
        { title: "TOPKIN Spesial Pemilu 2024", year: "2024", role: "Livestream, ANTV", text: "Election special, live.", link: "" },
        { title: "Sidang Isbat 2026", year: "2026", role: "Livestream, ANTV", text: "Live coverage of the Sidang Isbat.", link: "" },
        { title: "Kangen Joget ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", link: "" },
        { title: "Grebeg Pasar ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", link: "" },
        { title: "X-School Fest ANTV", year: "", role: "Livestream, ANTV", text: "Live event stream.", link: "" }
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
      blurb: "Nothing happens. Everything is seen. A man with a camera waits for the light, and the light, eventually, agrees. Presented in stillness, with long silences.",
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
