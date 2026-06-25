import { ReportData } from "../types";

export const initialReportData: ReportData = {
  greeting: "Assalamualaikum dan Salam Sejahtera,",
  recipients: [
    "YDH Dato KP Melaka",
    "YDH Datuk Timb KP Melaka",
    "YDH Tuan / Puan KJ"
  ],
  title: "MAJLIS PENUTUPAN PROGRAM WAKIL RAKYAT UNTUK RAKYAT (WRUR) PARLIMEN KOTA MELAKA : KAMPUNG KITA DUN TELOK MAS",
  date: "20 Jun 2026 (Sabtu)",
  timeRange: "8.00 malam sehingga 10.30 malam",
  venue: "Padang Bola Sepak, Taman Seri Telok Mas, Melaka",
  securityDuties: [
    { id: "s1", title: "PKP", count: 1 },
    { id: "s2", title: "PRP", count: 6 }
  ],
  vips: [
    {
      id: "v1",
      name: "Tuan Yang Terutama (TYT) Tun Seri Setia (Dr.) Haji Mohd Ali bin Mohd Rustam (Yang di-Pertua Negeri Melaka) bersama isteri Toh Puan Datuk Wira (Dr) Hajah Asmah binti Abdul Rahman",
      selected: true
    },
    {
      id: "v2",
      name: "YAB Datuk Seri Utama Ab. Rauf bin Yusoh (Ketua Menteri Melaka) bersama isteri Datin Seri Utama Datuk Wira Zuriyah binti Ab. Aziz",
      selected: true
    },
    {
      id: "v3",
      name: "Tuan Yang Terutama (TYT) Tun Seri Setia (Dr.) Haji Mohd Ali bin Mohd Rustam (Yang di-Pertua Negeri Melaka)",
      selected: false
    },
    {
      id: "v4",
      name: "YAB Datuk Seri Utama Ab. Rauf bin Yusoh (Ketua Menteri Melaka)",
      selected: false
    },
    {
      id: "v5",
      name: "Dato' Wira Azhar Bin Arshad (Setiausaha Kerajaan Negeri Melaka)",
      selected: true
    },
    {
      id: "v6",
      name: "Datuk Wira Salhah Binti Salleh - (Pegawai Kewangan Negeri Melaka)",
      selected: true
    },
    {
      id: "v7",
      name: "YB Datuk Rais Bin Datuk Wira Yasin (Exco Kanan Perumahan, Kerajaan Tempatan dan Saliran , Perubahan Iklim dan Pengurusan Bencana)",
      selected: true
    },
    {
      id: "v8",
      name: "YB Datuk Wira Abdul Razak bin Abdul Rahman (Exco Pelancongan, Warisan, Seni & Budaya , ADUN Telok Mas)",
      selected: true
    },
    {
      id: "v9",
      name: "YB Datuk Hajah Kalsom Binti Noordin (Exco Pembangunan Wanita, Keluarga dan Komuniti)",
      selected: true
    },
    {
      id: "v10",
      name: "YB Datuk Ngwe Hee Sem (Exco Kesihatan, Sumber Manusia dan Perpaduan)",
      selected: true
    },
    {
      id: "v11",
      name: "YB Datuk Rahmad Bin Mariman (Exco Pendidikan, Pengajian Tinggi dan Hal Ehwal Agama)",
      selected: true
    },
    {
      id: "v12",
      name: "YB Tuan Allex Seah Shoo Chin (Exco Pembangunan Usahawan, Koperasi dan Hal Ehwal Pengguna)",
      selected: true
    },
    {
      id: "v13",
      name: "YB Datuk Hameed Bin Mytheen Kunju Basheer (Exco Kerja Raya, Infastruktur, Kemudahan Awam dan Pengangkutan)",
      selected: true
    },
    {
      id: "v14",
      name: "YB Datuk Fairul Nizam bin Roslan (EXCO Sains, Teknologi, Inovasi dan Komunikasi Digital)",
      selected: true
    },
    {
      id: "v15",
      name: "YB Datuk P. Shanmugam A/L Pitchay (EXCO Belia, Sukan dan NGO)",
      selected: true
    },
    {
      id: "v16",
      name: "YB Datuk Wira Mohd Noor Helmy bin Abdul Halem (ADUN Duyong)",
      selected: true
    },
    {
      id: "v17",
      name: "YB Leng Chau Yen (ADUN Banda Hilir)",
      selected: true
    },
    {
      id: "v18",
      name: "Datuk Khaidirah binti Datuk Seri Abu Zahar (ADUN Rim)",
      selected: true
    },
    {
      id: "v19",
      name: "Isteri-Isteri Wakil Rakyat",
      selected: true
    },
    {
      id: "v20",
      name: "DCP Dato' Dzulkhairi Bin Mukhtar (Ketua Polis Melaka)",
      selected: true
    },
    {
      id: "v21",
      name: "SAC Datuk Ahmad Jefferi bin Abdullah (Timb Ketua Polis Melaka)",
      selected: true
    },
    {
      id: "v22",
      name: "Datuk Shahdan bin Othman - Datuk Bandar MBMB",
      selected: true
    },
    {
      id: "v23",
      name: "Ketua-Ketua Jabatan / KPD",
      selected: true
    }
  ],
  agendas: [
    {
      id: "a1",
      time: "8.20 malam",
      items: ["Ketibaan Dif-dif Kehormat"]
    },
    {
      id: "a2",
      time: "8.40 malam",
      items: [
        "Ketibaan YAB Datuk Seri Utama Ab. Rauf bin Yusoh (Ketua Menteri Melaka)",
        "Persembahan Pembukaan",
        "Jamuan Makan",
        "Bacaan Doa",
        "Ucapan Aluan Oleh : YB Datuk Wira Abdul Razak bin Abdul Rahman (Exco Pelancongan, Warisan, Seni & Budaya , ADUN Telok Mas)",
        "Tayangan Montaj Program WRUR Parlimen Kota Melaka : Kampung Kita",
        "Ucapan Perasmian Penutupan Oleh : YAB Datuk Seri Utama Ab. Rauf bin Yusoh (Ketua Menteri Melaka)",
        "Penyerahan Kad Pengenalan dan Plak Kampung Digital Dun Telok Mas",
        "Penyerahan Pengharagaan Ikon TVET Dun Telok Mas",
        "Penyerahan Pengharagaan Tokoh Seni Budaya Dun Telok Mas",
        "Penyampaian Penghargaan Tokoh Sukan Dun Telok Mas",
        "Penyampaian Penghargaan Tokoh Pendidikan Dun Telok Mas",
        "Penyampaian Penghargaan Tokoh Keagamaan Dun Telok Mas",
        "Penyampaian Penghargaan Tokoh Pentadbiran Dun Telok Mas",
        "Gimik Penyerahan WRUR Parlimen Kota Melaka kepada WRUR Parlimen Jasin",
        "Cabutan Bertuah",
        "Penyampaian Cenderamata kepada YAB Datuk Seri Utama Ab. Rauf bin Yusoh (Ketua Menteri Melaka)",
        "Sidang Media"
      ]
    },
    {
      id: "a3",
      time: "10.30 malam",
      items: ["Majlis bersurai / Keberangkatan pulang VVIP"]
    }
  ],
  attendanceCount: "1,000 orang",
  customNotes: "Program Wakil Rakyat Untuk Rakyat (WRUR) Parlimen Kota Melaka berjalan dengan lancar, meriah dan dihadiri komuniti setempat.",
  ulasanPoints: [
    "Program Wakil Rakyat Untuk Rakyat (WRUR) Parlimen Kota Melaka: Kampung Kita DUN Telok Mas merupakan inisiatif Kerajaan Negeri Melaka yang bertujuan memperkukuh hubungan antara kerajaan, agensi serta masyarakat melalui pelbagai aktiviti kemasyarakatan, kebajikan, pendidikan, kesihatan, sukan dan pembangunan komuniti.",
    "Program ini turut menjadi platform untuk mendengar denyut nadi rakyat serta menyelesaikan pelbagai isu dan keperluan komuniti secara terus di lapangan.",
    "Program ini dihadiri oleh Ketua Menteri Melaka, pemimpin kerajaan, wakil agensi, pemimpin masyarakat serta penduduk setempat.",
    "Anggaran kehadiran adalah seramai 1,000 orang.",
    "Tiada sebarang insiden keselamatan yang tidak diingini dilaporkan sepanjang program berlangsung dan majlis telah berjalan dengan lancar, aman serta terkawal hasil kerjasama semua pihak yang terlibat."
  ]
};
