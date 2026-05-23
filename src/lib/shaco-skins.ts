export const SHACO_SKINS = [
  { num: '0',  name: 'Clássico' },
  { num: '1',  name: 'Chapeleiro Maluco' },
  { num: '2',  name: 'Bobo da Corte' },
  { num: '3',  name: 'Quebra-nozes' },
  { num: '4',  name: 'De Brinquedo' },
  { num: '5',  name: 'Do Manicômio' },
  { num: '6',  name: 'Goseong' },
  { num: '8',  name: 'Estrela Negra' },
  { num: '15', name: 'Arcanista' },
  { num: '23', name: 'Pesadelo na Cidade do Crime' },
  { num: '33', name: 'Bênção do Inverno' },
  { num: '43', name: 'Soul Fighter' },
  { num: '44', name: 'Soul Fighter de Prestígio' },
  { num: '54', name: 'Noite Apavorante' },
  { num: '64', name: 'Gatinho-Surpresa' },
  { num: '71', name: 'Pandemônio de Prestígio' },
] as const

export const VALID_SKIN_NUMS = new Set(SHACO_SKINS.map((s) => s.num))

export function splashUrl(num: string): string {
  return `https://cdn.communitydragon.org/latest/champion/Shaco/splash-art/centered/skin/${num}`
}
