export interface SatkerOption {
  id: string;
  shortCode: string;
  name: string;
}

export const DAFTAR_SATKER: SatkerOption[] = [
  {
    id: 'ditjen-ahu',
    shortCode: 'DITJEN AHU',
    name: 'Direktorat Jenderal Administrasi Hukum Umum',
  },
  {
    id: 'kanwil-sumsel',
    shortCode: 'KANWIL SUMSEL',
    name: 'Kantor Wilayah Kementerian Hukum Sumatera Selatan',
  },
  {
    id: 'kanwil-jabar',
    shortCode: 'KANWIL JABAR',
    name: 'Kantor Wilayah Kementerian Hukum Jawa Barat',
  },
  {
    id: 'kanwil-kalbar',
    shortCode: 'KANWIL KALBAR',
    name: 'Kantor Wilayah Kementerian Hukum Kalimantan Barat',
  },
  {
    id: 'kanwil-sulteng',
    shortCode: 'KANWIL SULTENG',
    name: 'Kantor Wilayah Kementerian Hukum Sulawesi Tengah',
  },
  {
    id: 'kanwil-ntt',
    shortCode: 'KANWIL NTT',
    name: 'Kantor Wilayah Kementerian Hukum Nusa Tenggara Timur',
  },
  {
    id: 'kanwil-papua-barat',
    shortCode: 'KANWIL PAPUA BARAT',
    name: 'Kantor Wilayah Kementerian Hukum Papua Barat',
  },
];
