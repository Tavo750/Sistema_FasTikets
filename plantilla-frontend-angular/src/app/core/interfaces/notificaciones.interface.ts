export interface NotificacionesResponse {
  ok:      boolean;
  mensaje: string;
  data:    Data;
}

export interface Data {
  content:          Content[];
  pageable:         Pageable;
  totalElements:    number;
  totalPages:       number;
  last:             boolean;
  size:             number;
  number:           number;
  numberOfElements: number;
  sort:             Sort;
  first:            boolean;
  empty:            boolean;
}

export interface Content {
  id:           number;
  personaId:    number;
  tipo:         string;
  titulo:       string;
  mensaje:      string;
  leida:        boolean;
  creadaEn:     Date;
  leidaEn:      null;
  metadataJson: null;
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  sort:       Sort;
  offset:     number;
  paged:      boolean;
  unpaged:    boolean;
}

export interface Sort {
  empty:    boolean;
  sorted:   boolean;
  unsorted: boolean;
}
