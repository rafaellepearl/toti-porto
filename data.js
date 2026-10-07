/* ------------------------------------------------------------------
   TOTI VIDEO — store inventory.
   Edit this file to add, remove or change tapes. No other file needs
   to change. Every cover is drawn by main.js from these fields.

   art:     memory | phone | pitch | city | eye | antenna | boxes | houses | morph
   pal:     0-3 (colour scheme of the cover), leave out for automatic
   link:    where the WATCH button goes; leave "" if there is none yet
   sticker: small round sticker on the box (optional)
------------------------------------------------------------------- */
const DATA = {
  aisles: [
    {
      id: "films", name: "Short Films", tag: "New Releases",
      tapes: [
        {
          title: "All About Melly", year: "2023", art: "memory", pal: 0, sticker: "STAFF PICK",
          role: "Co-Producer, Writer, Director, Editor",
          blurb: "An experimental film using the filmmaker's real audio-visual archive to craft a fictional narrative about grief, memory, and moving on.",
          notes: "Screened at the National Gallery of Indonesia, 1 international film festival and 5 national film festivals.",
          link: "https://drive.google.com/file/d/1ga_EJ53XEZ3vcpf_rZYJ8ZCwE--yi7Pk/view?usp=sharing"
        },
        {
          title: "Hello, Goodbye", year: "2025", art: "phone", pal: 2, sticker: "NEW",
          role: "Co-Producer, Writer, Director, Editor",
          blurb: "Farrel, a man in his late 20s, calls his sister, a co-worker, and an old friend from high school. What's going on with Farrel?",
          link: "https://drive.google.com/file/d/1buWFFBUiPgKIb047pH1h0x0RLQM2_2LL/view?usp=sharing"
        }
      ]
    },
    {
      id: "docs", name: "Essays & Journalism", tag: "Documentary",
      tapes: [
        {
          title: "The Rise and Fall of Indonesian Exploitation Film", year: "2026", art: "eye", pal: 2, sticker: "NEW",
          role: "Writer, Presenter",
          blurb: "A video essay exploring the vast history of Indonesian exploitation film.",
          link: "https://drive.google.com/file/d/1AZde1kzyUMJHwG61QehhfMweX0KaRN1j/view?usp=sharing"
        },
        {
          title: "MyCity", year: "2023", art: "city", pal: 1,
          role: "Video Journalist",
          blurb: "Full-lifecycle video journalism: deep-dive investigative research, on-camera interviews, producing workflows, and cinematic videography tailored for digital platforms.",
          link: ""
        }
      ]
    },
    {
      id: "tv", name: "Broadcast & Content", tag: "Sports / TV",
      tapes: [
        {
          title: "Lensor Match", year: "2024–2025", art: "pitch", pal: 3,
          role: "Content Specialist, ANTV",
          blurb: "A channel re-circulating classic Indonesian football matches from 1994 to 2015 — the first official release of the archive since it aired.",
          notes: "Managed the channel, cut long-form and short-form videos, designed YouTube thumbnails, and wrote targeted SEO copy to revive interest in Indonesian sports history.",
          link: ""
        }
      ]
    },
    {
      id: "live", name: "Livestream", tag: "Live Events",
      tapes: [
        { title: "Pelantikan Presiden & Wapres 2024", year: "2024", art: "antenna", pal: 0, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Live broadcast of the 2024 presidential and vice-presidential inauguration.", link: "" },
        { title: "TOPKIN Spesial Pemilu 2024", year: "2024", art: "antenna", pal: 2, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Election special livestream.", link: "" },
        { title: "Sidang Isbat 2026", year: "2026", art: "antenna", pal: 3, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Live coverage of the Sidang Isbat.", link: "" },
        { title: "Kangen Joget ANTV", year: "", art: "antenna", pal: 1, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Live entertainment event stream.", link: "" },
        { title: "Grebeg Pasar ANTV", year: "", art: "antenna", pal: 2, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Live on-location event stream.", link: "" },
        { title: "X-School Fest ANTV", year: "", art: "antenna", pal: 0, sticker: "LIVE", role: "Livestream, ANTV", blurb: "Live school festival event stream.", link: "" }
      ]
    },
    {
      id: "commercial", name: "Producing Work", tag: "Commercial",
      tapes: [
        { title: "Lazada Logistic Company Profile", year: "", art: "boxes", pal: 1, role: "Producer", blurb: "Company profile for Lazada Logistic.", link: "https://drive.google.com/file/d/1QUad_thLeLjoFjJqylEgQYsUIwtaJyE6/view" },
        { title: "Citra Indah City", year: "", art: "houses", pal: 3, role: "Producer", blurb: "Advertisement for Citra Indah City.", link: "https://drive.google.com/file/d/1tSymwr-iWRVTz3XypUY8sFM9CjToy-gx/view?usp=sharing" },
        { title: "Lazada Logistic Rebrand", year: "", art: "morph", pal: 0, role: "Producer", blurb: "Rebranding announcement for Lazada Logistic.", link: "https://drive.google.com/file/d/1iO9XF53sN5mXeV0_EZ6QOIvowSk21Mwt/view?usp=sharing" }
      ]
    }
  ],

  /* Photography: put image files in a /photos folder next to index.html
     and list them here, e.g. { src: "photos/street-01.jpg", caption: "Jakarta, 2024" } */
  photos: []
};
