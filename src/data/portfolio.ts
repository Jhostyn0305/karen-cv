import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { evidenceMetadata } from './evidence-metadata';

export function getCases() {
  const directory = resolve('public/images/evidencias');
  return readdirSync(directory, { withFileTypes: true })
    .filter(file => file.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(file.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { numeric: true }))
    .map((file, index) => {
      const metadata = evidenceMetadata[file.name];
      return {
        id: file.name,
        image: `/images/evidencias/${encodeURIComponent(file.name)}`,
        title: metadata?.title ?? `Registro clínico ${String(index + 1).padStart(2, '0')}`,
        category: metadata?.category ?? 'Otros registros',
        description: metadata?.description ?? 'Registro fotográfico del portafolio clínico.',
        alt: metadata?.alt ?? `Fotografía del registro clínico ${index + 1}`,
        width: metadata?.width ?? 1280,
        height: metadata?.height ?? 1280,
      };
    });
}

export const competencies = [
  { icon: 'tooth', title: 'Odontología restauradora', description: 'Restauraciones directas e indirectas: inlay, onlay y overlay.' },
  { icon: 'tooth', title: 'Endodoncia', description: 'Endodoncias simples, pulpotomías y pulpectomías.' },
  { icon: 'sparkle', title: 'Rehabilitación oral', description: 'Coronas, puentes y reconstrucción con postes de fibra de vidrio.' },
  { icon: 'heart', title: 'Atención infantil', description: 'Odontopediatría y atención integral a pacientes pediátricos.' },
  { icon: 'shield', title: 'Prevención y salud bucal', description: 'Profilaxis, detartraje, flúor, sellantes y educación comunitaria.' },
  { icon: 'shield', title: 'Exodoncia y urgencias', description: 'Exodoncias simples y manejo inicial de urgencias odontológicas.' },
];

export const experience = [
  { years: '2025 — 2026', title: 'Odontóloga rural', place: 'Centro de Salud Tipo A Tiputini · MSP', location: 'Orellana, Ecuador', description: 'Atención integral de primer nivel, promoción de salud bucal en escuelas y comunidad, tratamientos preventivos y restauradores, exodoncias simples y urgencias.' },
  { years: 'ENE — SEP 2025', title: 'Odontóloga general', place: 'Clínica Odontológica UniversalDent', location: 'Quito, Ecuador', description: 'Diagnóstico y planificación individualizada, restauraciones directas e indirectas, endodoncia y rehabilitación oral con coronas y puentes.' },
  { years: 'OCT — DIC 2024', title: 'Odontóloga general', place: 'Clínica Odontológica FUDENT', location: 'Quito, Ecuador', description: 'Atención preventiva y estética, restauraciones, incrustaciones, exodoncias simples y manejo inicial de urgencias.' },
];
