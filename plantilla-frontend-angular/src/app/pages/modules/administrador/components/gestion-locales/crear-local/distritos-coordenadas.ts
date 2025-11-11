/**
 * Coordenadas geográficas de los distritos del Perú
 * Basado en ubigeo_peru_2016_distritos.json
 * Los IDs corresponden a los códigos de ubigeo de 6 dígitos
 */

export interface DistritoCoords {
  id: string;
  lat: number;
  lng: number;
  nombre: string;
}

/**
 * Tipo para las coordenadas [latitud, longitud]
 */
export type Coordenadas = [number, number];

/**
 * Mapa de coordenadas por ID de distrito (código de ubigeo)
 * Formato: { [ubigeoId: string]: [latitud, longitud] }
 */
export const DISTRITOS_COORDS_POR_ID: { [key: string]: [number, number] } = {
  // LIMA - LIMA (15)
  '150101': [-12.0464, -77.0428],  // Lima (Cercado)
  '150102': [-11.7850, -77.0831],  // Ancón
  '150103': [-12.0597, -76.9392],  // Ate
  '150104': [-12.1189, -77.0308],  // Barranco
  '150105': [-12.0608, -77.0278],  // Breña
  '150106': [-11.9406, -77.0472],  // Carabayllo
  '150107': [-12.0439, -76.8956],  // Chaclacayo
  '150108': [-12.1897, -76.9911],  // Chorrillos
  '150109': [-12.1139, -76.8461],  // Cieneguilla
  '150110': [-12.0403, -77.0808],  // Comas
  '150111': [-12.0597, -76.9392],  // El Agustino
  '150112': [-12.0022, -77.0631],  // Independencia
  '150113': [-12.0722, -77.0461],  // Jesús María
  '150114': [-12.0797, -76.9422],  // La Molina
  '150115': [-12.0897, -77.0282],  // La Victoria
  '150116': [-12.0931, -77.0465],  // Lince
  '150117': [-12.0403, -77.0808],  // Los Olivos
  '150118': [-12.0475, -76.9344],  // Lurigancho (Chosica)
  '150119': [-12.2894, -76.7867],  // Lurín
  '150120': [-12.0764, -77.1181],  // Magdalena del Mar
  '150121': [-12.0517, -77.0594],  // Pueblo Libre
  '150122': [-12.1525, -77.0144],  // Miraflores
  '150123': [-12.1847, -76.9753],  // Pachacamac
  '150124': [-12.3656, -76.8094],  // Pucusana
  '150125': [-11.8686, -77.0311],  // Puente Piedra
  '150126': [-12.2931, -76.8339],  // Punta Hermosa
  '150127': [-12.3364, -76.8017],  // Punta Negra
  '150128': [-12.0181, -77.0511],  // Rímac
  '150129': [-12.3925, -76.7983],  // San Bartolo
  '150130': [-12.1211, -77.0281],  // San Borja
  '150131': [-12.0753, -77.0514],  // San Isidro
  '150132': [-11.9997, -77.0167],  // San Juan de Lurigancho
  '150133': [-12.1586, -76.9733],  // San Juan de Miraflores
  '150134': [-12.0711, -77.0072],  // San Luis
  '150135': [-11.9789, -77.0731],  // San Martín de Porres
  '150136': [-12.0603, -77.1086],  // San Miguel
  '150137': [-12.0822, -76.7936],  // Santa Anita
  '150138': [-12.4172, -76.7947],  // Santa María del Mar
  '150139': [-11.9817, -77.0864],  // Santa Rosa
  '150140': [-12.1267, -76.9956],  // Santiago de Surco
  '150141': [-12.0969, -77.0378],  // Surquillo
  '150142': [-12.2128, -76.9378],  // Villa El Salvador
  '150143': [-12.2128, -76.9378],  // Villa María del Triunfo

  // CALLAO (07)
  '070101': [-12.0564, -77.1181],  // Callao (Cercado)
  '070102': [-12.0611, -77.1522],  // Bellavista
  '070103': [-12.0000, -77.1500],  // Carmen de la Legua Reynoso
  '070104': [-12.0367, -77.1386],  // La Perla
  '070105': [-12.0725, -77.1392],  // La Punta
  '070106': [-11.9486, -77.1456],  // Ventanilla
  '070107': [-11.8644, -77.1550],  // Mi Perú

  // AREQUIPA - AREQUIPA (04)
  '040101': [-16.3989, -71.5350],  // Arequipa (Cercado)
  '040102': [-16.4092, -71.5375],  // Alto Selva Alegre
  '040103': [-16.3667, -71.5333],  // Cayma
  '040104': [-16.3639, -71.5694],  // Cerro Colorado
  '040105': [-16.4167, -71.5833],  // Characato
  '040106': [-16.4333, -71.5333],  // Chiguata
  '040107': [-16.4728, -71.5289],  // Jacobo Hunter
  '040108': [-16.4319, -71.5092],  // La Joya
  '040109': [-16.3794, -71.5347],  // Mariano Melgar
  '040110': [-16.4417, -71.5500],  // Miraflores (Arequipa)
  '040111': [-16.3986, -71.5664],  // Mollebaya
  '040112': [-16.3725, -71.5508],  // Paucarpata
  '040113': [-16.4303, -71.4864],  // Pocsi
  '040114': [-16.4167, -71.5167],  // Polobaya
  '040115': [-16.3847, -71.6261],  // Quequeña
  '040116': [-16.3764, -71.5483],  // Sabandia
  '040117': [-16.3989, -71.5350],  // Sachaca
  '040118': [-16.3558, -71.5431],  // San Juan de Siguas
  '040119': [-16.2958, -71.5694],  // San Juan de Tarucani
  '040120': [-16.4042, -71.5264],  // Santa Isabel de Siguas
  '040121': [-16.4139, -71.5269],  // Santa Rita de Siguas
  '040122': [-16.3336, -71.5425],  // Socabaya
  '040123': [-16.4386, -71.5419],  // Tiabaya
  '040124': [-16.3931, -71.5806],  // Uchumayo
  '040125': [-16.4069, -71.5247],  // Vitor
  '040126': [-16.3947, -71.5350],  // Yanahuara
  '040127': [-16.4194, -71.4958],  // Yarabamba
  '040128': [-16.4228, -71.5378],  // Yura
  '040129': [-16.4000, -71.5200],  // José Luis Bustamante Y Rivero

  // CUSCO - CUSCO (08)
  '080101': [-13.5319, -71.9675],  // Cusco (Cercado)
  '080102': [-13.5244, -71.9722],  // Ccorca
  '080103': [-13.4714, -71.9347],  // Poroy
  '080104': [-13.5197, -71.9781],  // San Jerónimo
  '080105': [-13.5364, -71.9547],  // San Sebastián
  '080106': [-13.5153, -71.9489],  // Santiago
  '080107': [-13.5378, -71.9881],  // Saylla
  '080108': [-13.5267, -71.9539],  // Wanchaq

  // LA LIBERTAD - TRUJILLO (13)
  '130101': [-8.1116, -79.0288],   // Trujillo
  '130102': [-8.0908, -79.0400],   // El Porvenir
  '130103': [-8.1411, -79.0250],   // Florencia de Mora
  '130104': [-8.0786, -79.0303],   // Huanchaco
  '130105': [-8.1333, -79.0322],   // La Esperanza
  '130106': [-8.1000, -78.9833],   // Laredo
  '130107': [-8.0892, -79.0706],   // Moche
  '130108': [-8.1458, -79.0514],   // Poroto
  '130109': [-8.0842, -79.0928],   // Salaverry
  '130110': [-8.1547, -79.0147],   // Simbal
  '130111': [-8.1117, -79.0192],   // Victor Larco Herrera

  // LAMBAYEQUE - CHICLAYO (14)
  '140101': [-6.7714, -79.8406],   // Chiclayo
  '140102': [-6.7853, -79.8497],   // Chongoyape
  '140103': [-6.8583, -79.8139],   // Eten
  '140104': [-6.9244, -79.8697],   // Eten Puerto
  '140105': [-6.7508, -79.8622],   // José Leonardo Ortiz
  '140106': [-6.7000, -79.9167],   // La Victoria
  '140107': [-6.7017, -79.9067],   // Lagunas
  '140108': [-6.7706, -79.8342],   // Monsefú
  '140109': [-6.5500, -79.7833],   // Nueva Arica
  '140110': [-6.8667, -79.7500],   // Oyotún
  '140111': [-6.9439, -79.8583],   // Picsi
  '140112': [-6.7756, -79.8311],   // Pimentel
  '140113': [-6.6833, -79.8333],   // Reque
  '140114': [-6.8167, -79.8500],   // Santa Rosa
  '140115': [-6.6333, -79.8667],   // Saña
  '140116': [-6.7500, -79.8600],   // Cayaltí
  '140117': [-6.6667, -79.7500],   // Patapo
  '140118': [-6.7508, -79.8239],   // Pomalca
  '140119': [-6.8000, -79.8667],   // Pucalá
  '140120': [-6.7667, -79.8500],   // Tumán

  // PIURA - PIURA (20)
  '200101': [-5.1945, -80.6328],   // Piura
  '200104': [-5.1778, -80.6556],   // Castilla
  '200105': [-5.1689, -80.7172],   // Catacaos
  '200107': [-5.0881, -80.6686],   // Cura Mori
  '200108': [-5.1194, -80.8222],   // El Tallán
  '200109': [-5.3528, -80.7039],   // La Arena
  '200110': [-5.2486, -80.6583],   // La Unión
  '200111': [-4.9000, -80.6167],   // Las Lomas
  '200114': [-5.0722, -80.4583],   // Tambo Grande

  // LORETO - IQUITOS (16)
  '160101': [-3.7437, -73.2516],   // Iquitos
  '160102': [-3.7333, -73.2333],   // Alto Nanay
  '160103': [-3.7833, -73.2500],   // Fernando Lores
  '160104': [-3.7500, -73.2833],   // Indiana
  '160105': [-3.8167, -73.2333],   // Las Amazonas
  '160106': [-3.7000, -73.2667],   // Mazán
  '160107': [-3.7167, -73.3000],   // Napo
  '160108': [-3.7833, -73.3333],   // Punchana
  '160110': [-3.7000, -73.3500],   // Torres Causana
  '160112': [-3.6667, -73.2167],   // Belén
  '160113': [-3.7833, -73.1833],   // San Juan Bautista

  // CAJAMARCA - CAJAMARCA (06)
  '060101': [-7.1617, -78.5128],   // Cajamarca
  '060108': [-7.1500, -78.5000],   // Los Baños del Inca

  // PUNO - PUNO (21)
  '210101': [-15.8402, -70.0219],  // Puno
  '211101': [-15.5000, -70.1333],  // Juliaca

  // ICA - ICA (11)
  '110101': [-14.0678, -75.7286],  // Ica
  '110201': [-13.4206, -76.1514],  // Chincha Alta
  '110301': [-14.8419, -75.1319],  // Nazca
  '110501': [-13.7278, -76.2847],  // Pisco

  // JUNÍN - HUANCAYO (12)
  '120101': [-12.0686, -75.2042],  // Huancayo
  '120114': [-12.0500, -75.2167],  // El Tambo

  // ANCASH - HUARAZ (02)
  '020101': [-9.5277, -77.5278],   // Huaraz
  '020105': [-9.5500, -77.3833],   // Independencia

  // AYACUCHO - AYACUCHO (05)
  '050101': [-13.1631, -74.2236],  // Ayacucho
  '050110': [-13.0833, -74.2333],  // San Juan Bautista

  // HUANCAVELICA - HUANCAVELICA (09)
  '090101': [-12.7869, -74.9761],  // Huancavelica

  // HUÁNUCO - HUÁNUCO (10)
  '100101': [-9.9306, -76.2422],   // Huánuco
  '100102': [-9.9167, -76.2333],   // Amarilis

  // MADRE DE DIOS - TAMBOPATA (17)
  '170101': [-12.5931, -69.1892],  // Tambopata (Puerto Maldonado)

  // MOQUEGUA - MOQUEGUA (18)
  '180101': [-17.1933, -70.9356],  // Moquegua
  '180301': [-17.6350, -71.3333],  // Ilo

  // PASCO - PASCO (19)
  '190101': [-10.6831, -76.2564],  // Chaupimarca (Cerro de Pasco)
  '190301': [-10.4000, -75.5833],  // Oxapampa

  // SAN MARTÍN - SAN MARTÍN (22)
  '220101': [-6.4867, -76.3647],   // Moyobamba
  '220901': [-6.0319, -77.0869],   // Tarapoto
  '220801': [-5.5500, -77.4833],   // Rioja

  // TACNA - TACNA (23)
  '230101': [-18.0147, -70.2536],  // Tacna
  '230102': [-17.9833, -70.2500],  // Alto de la Alianza

  // TUMBES - TUMBES (24)
  '240101': [-3.5669, -80.4517],   // Tumbes
  '240301': [-3.9500, -80.7333],   // Zarumilla

  // UCAYALI - CORONEL PORTILLO (25)
  '250101': [-8.3791, -74.5539],   // Callería (Pucallpa)
  '250105': [-8.2333, -74.9333],   // Yarinacocha

  // AMAZONAS - CHACHAPOYAS (01)
  '010101': [-6.2306, -77.8694],   // Chachapoyas

  // APURÍMAC - ABANCAY (03)
  '030101': [-13.6333, -73.3667],  // Abancay

  // Coordenadas por defecto (Lima) para distritos no especificados
  'DEFAULT': [-12.0464, -77.0428]
};

/**
 * Obtiene las coordenadas de un distrito por su ID de ubigeo
 * @param ubigeoId - ID del distrito en formato de 6 dígitos (ej: "150140")
 * @returns Array con [latitud, longitud] o coordenadas por defecto si no existe
 */
export function getCoordenadasPorUbigeo(ubigeoId: string): Coordenadas {
  return DISTRITOS_COORDS_POR_ID[ubigeoId] || DISTRITOS_COORDS_POR_ID['DEFAULT'];
}

/**
 * Verifica si existen coordenadas específicas para un distrito
 * @param ubigeoId - ID del distrito en formato de 6 dígitos
 * @returns true si existen coordenadas específicas, false si usará las por defecto
 */
export function tieneCoordenadasEspecificas(ubigeoId: string): boolean {
  return ubigeoId in DISTRITOS_COORDS_POR_ID && ubigeoId !== 'DEFAULT';
}

/**
 * Busca coordenadas por nombre de distrito (búsqueda aproximada)
 * @param nombreDistrito - Nombre del distrito
 * @returns Array con [latitud, longitud] o null si no se encuentra
 */
export function buscarCoordenadasPorNombre(nombreDistrito: string): Coordenadas | null {
  const nombreNormalizado = nombreDistrito.toLowerCase().trim();

  // Mapa de nombres de distrito a ubigeo ID (para los principales)
  const nombreAId: { [key: string]: string } = {
    'lima': '150101',
    'miraflores': '150122',
    'san isidro': '150131',
    'san borja': '150130',
    'surco': '150140',
    'santiago de surco': '150140',
    'la molina': '150114',
    'callao': '070101',
    'arequipa': '040101',
    'cusco': '080101',
    'trujillo': '130101',
    'chiclayo': '140101',
    'piura': '200101',
    'iquitos': '160101',
    'huancayo': '120101',
    'tacna': '230101',
    'puno': '210101',
    'juliaca': '211101',
    'ica': '110101',
    'pucallpa': '250101',
    'huaraz': '020101',
    'cajamarca': '060101',
    'ayacucho': '050101',
    'jesús maría': '150113',
    'jesus maria': '150113',
    'la victoria': '150115',
    'san juan de lurigancho': '150132',
    'san juan de miraflores': '150133',
    'villa el salvador': '150142',
    'comas': '150110',
    'ate': '150103',
    'san martín de porres': '150135',
    'san martin de porres': '150135',
    'independencia': '150112',
    'los olivos': '150117',
    'chorrillos': '150108',
    'barranco': '150104',
    'pueblo libre': '150121'
  };

  const ubigeoId = nombreAId[nombreNormalizado];
  return ubigeoId ? DISTRITOS_COORDS_POR_ID[ubigeoId] : null;
}

// Exportación por defecto para asegurar que el archivo sea reconocido como módulo
export default {
  DISTRITOS_COORDS_POR_ID,
  getCoordenadasPorUbigeo,
  tieneCoordenadasEspecificas,
  buscarCoordenadasPorNombre
};
