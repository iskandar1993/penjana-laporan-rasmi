import React, { useState } from "react";
import { BookOpen, Layers, Cpu, Share2, Save, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function MitAppInventorTutorial() {
  const [activeSection, setActiveSection] = useState<string>("intro");

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Panduan MIT App Inventor</h2>
          <p className="text-sm text-slate-500">Cara membina aplikasi penjana laporan ini secara 100% serupa pada telefon Android anda.</p>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6 text-sm">
        MIT App Inventor adalah platform visual yang membolehkan anda membuat aplikasi Android dengan mudah tanpa menulis kod teks. 
        Di bawah adalah langkah demi langkah untuk membina semula format laporan rasmi ini, lengkap dengan fungsi **memilih VIP, menyusun VVIP, memasukkan agenda,** dan **berkongsi terus ke WhatsApp (dengan format bold * bintang).**
      </p>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* Section 1: Intro */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("intro")}
            className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-50 transition text-left font-semibold text-slate-700 text-sm"
          >
            <span className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>1. Penyediaan Komponen (Designer View)</span>
            </span>
            {activeSection === "intro" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === "intro" && (
            <div className="p-5 border-t border-slate-50 bg-white space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <p>
                Susun komponen berikut di dalam skrin utama anda (<strong>Screen1</strong>) mengikut susun atur menegak (<strong>VerticalScrollArrangement</strong>):
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-slate-800">Maklumat Asas (TextBox):</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li><code>txtTajuk</code> (TextBox - untuk Tajuk Majlis)</li>
                    <li><code>txtTarikh</code> (TextBox - untuk Tarikh)</li>
                    <li><code>txtMasa</code> (TextBox - untuk Masa)</li>
                    <li><code>txtTempat</code> (TextBox - untuk Tempat)</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-slate-800">Penugasan Kawalan Keselamatan:</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li><code>txtPKP</code> (TextBox - Bilangan PKP, tetapkan jenis input kepada Nombor)</li>
                    <li><code>txtPRP</code> (TextBox - Bilangan PRP, tetapkan jenis input kepada Nombor)</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-slate-800">Pemilihan VIP (ListView & CheckBox):</strong>
                  <p className="mt-1">
                    Gunakan <strong>ListView</strong> atau beberapa <strong>CheckBox</strong> di dalam skrin. 
                    Untuk memudahkan pengurusan, buat satu <code>ListViewVIP</code> untuk memaparkan senarai nama VIP yang boleh ditanda/klik.
                  </p>
                </li>
                <li>
                  <strong className="text-slate-800">Butang Tindakan:</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li><code>btnJanaLaporan</code> (Button - untuk mencantumkan semua teks)</li>
                    <li><code>btnKongsiWhatsApp</code> (Button - untuk menghantar terus)</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-slate-800">Komponen Bukan Visual (Non-visible):</strong>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li><code>Sharing1</code> (Dari palet Social - digunakan untuk hantar ke WhatsApp/Emel)</li>
                    <li><code>TinyDB1</code> (Dari palet Storage - untuk menyimpan nama VIP dan tetapan default supaya tidak hilang apabila aplikasi ditutup)</li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Section 2: Logic Block */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("blocks")}
            className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-50 transition text-left font-semibold text-slate-700 text-sm"
          >
            <span className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>2. Penyusunan Blok Logik (Blocks Editor)</span>
            </span>
            {activeSection === "blocks" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === "blocks" && (
            <div className="p-5 border-t border-slate-50 bg-white space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800">A. Mencantumkan Teks Laporan (String Concatenation)</p>
              <p>
                Untuk menghasilkan format laporan 100% sebijik seperti contoh, anda perlu menggunakan blok <strong>join</strong> di bawah menu <strong>Text</strong>. 
                Penting: Gunakan simbol asterik (<code>*</code>) untuk menebalkan (bold) teks di WhatsApp, dan pemisah baris baharu (<strong>\n</strong> atau kotak text kosong yang ditekan Enter) untuk melompat ke baris bawah.
              </p>
              
              <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
                <div>join (</div>
                <div className="pl-4">"Assalamualaikum dan Salam Sejahtera,\n\n"</div>
                <div className="pl-4">"YDH Dato KP Melaka,\n"</div>
                <div className="pl-4">"YDH Datuk Timb KP Melaka,\n"</div>
                <div className="pl-4">"YDH Tuan / Puan KJ,\n\n"</div>
                <div className="pl-4">"*" , txtTajuk.Text , "*\n\n"</div>
                <div className="pl-4">"Tarikh : " , txtTarikh.Text , "\n"</div>
                <div className="pl-4">"Masa : " , txtMasa.Text , "\n"</div>
                <div className="pl-4">"Tempat : " , txtTempat.Text , "\n\n"</div>
                <div className="pl-4">"*Penugasan Kawalan Keselamatan :*\n"</div>
                <div className="pl-4">"- " , txtPKP.Text , " PKP\n"</div>
                <div className="pl-4">"- " , txtPRP.Text , " PRP\n\n"</div>
                <div className="pl-4">"..." (ulangi cantuman untuk VIP dan Aturcara)</div>
                <div>)</div>
              </div>

              <p className="font-semibold text-slate-800 mt-4">B. Logik Memilih dan Menyusun VIP</p>
              <p>
                Dalam MIT App Inventor, anda boleh menggunakan <code>List</code> untuk menyimpan senarai VIP. 
                Untuk membolehkan menukar posisi atas/bawah, gunakan kaedah penukaran indeks:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Simpan VIP terpilih dalam <code>global list_VVIP</code>.
                </li>
                <li>
                  Untuk menggerakkan VIP ke atas (indeks <code>N</code> ke <code>N-1</code>):
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Simpan sementara item di <code>N-1</code> ke dalam pembolehubah <code>temp</code>.</li>
                    <li>Gantikan item di <code>N-1</code> dengan item di <code>N</code>.</li>
                    <li>Gantikan item di <code>N</code> dengan <code>temp</code>.</li>
                    <li>Kemaskini paparan ListView anda!</li>
                  </ul>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Section 3: WhatsApp Integration */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("whatsapp")}
            className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-50 transition text-left font-semibold text-slate-700 text-sm"
          >
            <span className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-green-500" />
              <span>3. Penghantaran ke WhatsApp</span>
            </span>
            {activeSection === "whatsapp" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === "whatsapp" && (
            <div className="p-5 border-t border-slate-50 bg-white space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <p>
                Selepas mencantumkan teks laporan ke dalam satu pembolehubah global (contohnya <code>global_TeksLaporan</code>), anda boleh berkongsi terus menggunakan komponen <strong>Sharing</strong>:
              </p>
              
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                  <span>Blok Utama yang Digunakan:</span>
                </div>
                <p className="text-emerald-700 font-mono text-xs">
                  call Sharing1 .ShareMessage ( message = global_TeksLaporan )
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Apabila butang "Kongsi" diklik, telefon akan membuka senarai aplikasi (termasuk WhatsApp). 
                  Anda hanya perlu memilih kumpulan WhatsApp balai atau pegawai untuk menghantar laporan lengkap tersebut dengan format yang sangat kemas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Saving State with TinyDB */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection("tinydb")}
            className="w-full flex items-center justify-between p-4 bg-slate-50/60 hover:bg-slate-50 transition text-left font-semibold text-slate-700 text-sm"
          >
            <span className="flex items-center space-x-2">
              <Save className="w-4 h-4 text-indigo-500" />
              <span>4. Menyimpan Tetapan Laluan (TinyDB)</span>
            </span>
            {activeSection === "tinydb" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === "tinydb" && (
            <div className="p-5 border-t border-slate-50 bg-white space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <p>
                Supaya senarai 23 VIP lalai dan maklumat kekal seperti KP Melaka, timbalan dan exco tidak perlu ditaip setiap kali aplikasi dibuka:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-slate-800">Semasa Screen1.Initialize:</strong>
                  <p className="mt-1">
                    Gunakan blok <code>call TinyDB1.GetValue</code> dengan tag <code>"SenaraiVIP"</code>. 
                    Jika tag kosong (valueIfTagNotThere), muatkan senarai asal 23 VIP yang kita tetapkan dalam bentuk <code>make a list</code>.
                  </p>
                </li>
                <li>
                  <strong className="text-slate-800">Semasa menambah VIP atau menukar kedudukan:</strong>
                  <p className="mt-1">
                    Setiap kali ada penambahan atau penukaran susunan, panggil <code>call TinyDB1.StoreValue</code> dengan tag <code>"SenaraiVIP"</code> dan masukkan senarai VVIP yang terkini.
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start space-x-3 text-xs md:text-sm text-amber-800">
        <HelpCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Tip Tambahan:</strong> Untuk membuat fungsi penjanaan AI (Jana Ulasan) terus di dalam MIT App Inventor, anda boleh menggunakan komponen <strong>Web</strong> untuk menghantar permintaan API <code>POST</code> ke pelayan perantaraan (seperti backend yang dibina dalam aplikasi ini) untuk mendapatkan jawapan teks ulasan secara automatik.
        </div>
      </div>
    </div>
  );
}
