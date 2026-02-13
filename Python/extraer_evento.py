import spacy
import re
from datetime import datetime, timedelta
from dateparser.search import search_dates
import os

# Cargar modelo spaCy en español
nlp = spacy.load("es_core_news_md")

# === Cargar palabras clave desde archivos ===
def cargar_palabras_clave(ruta_archivo):
    try:
        with open(ruta_archivo, encoding="utf-8") as f:
            return [linea.strip().lower() for linea in f if linea.strip()]
    except Exception as e:
        print(f"⚠️ Error cargando {ruta_archivo}: {e}")
        return []

CARPETA_CLAVES = os.path.dirname(__file__)
PALABRAS_CLAVE_EVENTOS = cargar_palabras_clave(os.path.join(CARPETA_CLAVES, "palabras_clave_descripcion.txt"))
MESES = cargar_palabras_clave(os.path.join(CARPETA_CLAVES, "palabras_clave_fecha.txt"))

# === Detección de evento de día completo ===
def es_evento_dia_completo(texto: str) -> bool:
    texto_lower = texto.lower()
    return any(frase in texto_lower for frase in ["todo el día", "durante todo el día", "día completo", "todo el dia"])

# === Extracción del nombre del evento ===
def extraer_nombre_evento(texto: str, personas: list) -> str:
    texto_lower = texto.lower()

    match_comillas = re.search(r"(evento|reunión|cita|fiesta|capacitación|taller|charla)\s+[\"'](.+?)[\"']", texto_lower)
    if match_comillas:
        tipo, nombre = match_comillas.groups()
        return f"{tipo.capitalize()}: {nombre.strip().capitalize()}"

    match_amplio = re.search(
        r"(capacitaci[oó]n(?: de| sobre)?\s+\w.+?|taller(?: de)?\s+\w.+?|fiesta de\s+\w+|reuni[oó]n con\s+\w+|charla sobre\s+\w.+?)",
        texto_lower
    )
    if match_amplio:
        return match_amplio.group(1).strip().capitalize()

    for palabra in sorted(PALABRAS_CLAVE_EVENTOS, key=len, reverse=True):
        if palabra in texto_lower:
            return palabra.capitalize()

    if personas:
        return f"Reunión con {personas[0].capitalize()}"

    return "Evento sin nombre"

# === Generación de descripción ===
def generar_descripcion(texto):
    texto = texto.strip()
    if not texto:
        return "Descripción no disponible"
    return texto.capitalize()

# === Día de la semana ===
def detectar_dia_semana(texto: str, base_time: datetime) -> tuple:
    dias_semana_map = {
        "lunes": 0, "martes": 1, "miércoles": 2, "miercoles": 2,
        "jueves": 3, "viernes": 4, "sábado": 5, "sabado": 5,
        "domingo": 6
    }

    texto_lower = texto.lower()
    for dia_str, idx in dias_semana_map.items():
        if re.search(rf"\b{dia_str}\b", texto_lower):
            hoy = base_time.weekday()
            diferencia = (idx - hoy + 7) % 7
            fecha_calculada = base_time + timedelta(days=diferencia)
            return fecha_calculada, idx

    return None, None

# === Ajuste de hora AM/PM ===
def ajustar_hora_por_periodo(hora, periodo):
    if periodo == "tarde" and hora < 12:
        return hora + 12
    elif periodo == "noche" and hora < 12:
        return hora + 12
    elif periodo == "mañana" and hora == 12:
        return 0
    return hora

# === Extracción mejorada de rango de horas ===
def extraer_rango_horas_natural(texto: str, base_date: datetime) -> tuple:
    texto = texto.lower()

    patron = re.search(
        r"(?:desde\s*)?(?:a\s*las\s*)?"
        r"(\d{1,2})(?::(\d{2}))?\s*"
        r"(am|pm|de la mañana|de la tarde|de la noche)?"
        r"\s*(?:hasta|a)\s*(?:las\s*)?"
        r"(\d{1,2})(?::(\d{2}))?\s*"
        r"(am|pm|de la mañana|de la tarde|de la noche)?",
        texto
    )

    if not patron:
        return None, None

    hi, mi, periodo_i, hf, mf, periodo_f = patron.groups()

    hi = int(hi)
    mi = int(mi) if mi else 0
    hf = int(hf)
    mf = int(mf) if mf else 0

    def convertir_24h(hora, periodo):
        if periodo:
            if periodo in ["pm", "de la tarde", "de la noche"] and hora < 12:
                hora += 12
            elif periodo in ["am", "de la mañana"] and hora == 12:
                hora = 0
        return hora

    hora_inicio = convertir_24h(hi, periodo_i)
    hora_fin = convertir_24h(hf, periodo_f or periodo_i)

    inicio = base_date.replace(hour=hora_inicio, minute=mi, second=0, microsecond=0)
    fin = base_date.replace(hour=hora_fin, minute=mf, second=0, microsecond=0)

    if fin <= inicio:
        fin += timedelta(days=1)

    return inicio, fin

# === Función principal ===
def extraer_datos(texto: str):
    doc = nlp(texto)
    personas = [ent.text for ent in doc.ents if ent.label_ == "PER"]
    evento = extraer_nombre_evento(texto, personas)
    descripcion = generar_descripcion(texto)
    dia_completo = es_evento_dia_completo(texto)

    base_time = datetime.now()
    fecha_inicio_obj = None
    fecha_fin_obj = None

    fecha_dia_semana, dia_semana_idx = detectar_dia_semana(texto, base_time)

    try:
        resultados_fechas = search_dates(
            texto,
            languages=["es"],
            settings={
                "RELATIVE_BASE": base_time,
                "PREFER_DATES_FROM": "future",
                "RETURN_TIME_AS_PERIOD": False,
                "PREFER_DAY_OF_MONTH": "first",
            },
        )

        if resultados_fechas:
            resultados_fechas.sort(key=lambda x: texto.find(x[0]))
            fechas_detectadas_objs = [r[1] for r in resultados_fechas]
            fecha_inicio_obj = fechas_detectadas_objs[0]

        if fecha_dia_semana and fecha_inicio_obj:
            if fecha_inicio_obj.weekday() != dia_semana_idx:
                fecha_inicio_obj = fecha_dia_semana.replace(
                    hour=fecha_inicio_obj.hour,
                    minute=fecha_inicio_obj.minute
                )
        elif fecha_dia_semana and not fecha_inicio_obj:
            fecha_inicio_obj = fecha_dia_semana

        if not fecha_inicio_obj:
            raise ValueError("No se pudo detectar fecha válida.")

        if dia_completo:
            fecha_inicio_obj = fecha_inicio_obj.replace(hour=0, minute=0, second=0, microsecond=0)
            fecha_fin_obj = fecha_inicio_obj.replace(hour=23, minute=59, second=59, microsecond=0)
        else:
            inicio_fin = extraer_rango_horas_natural(texto, fecha_inicio_obj)

            if inicio_fin and inicio_fin[0]:
                fecha_inicio_obj, fecha_fin_obj = inicio_fin
            else:
                fecha_fin_obj = fecha_inicio_obj + timedelta(hours=1)

    except Exception as e:
        print("❌ Error al parsear fechas:", e)
        return {
            "evento": evento,
            "descripcion": descripcion,
            "fechaInicio": "Error",
            "horaInicio": "Error",
            "fechaFin": "Error",
            "horaFin": "Error",
        }

    return {
        "evento": evento,
        "descripcion": descripcion,
        "fechaInicio": fecha_inicio_obj.strftime("%Y-%m-%d"),
        "horaInicio": fecha_inicio_obj.strftime("%H:%M"),
        "fechaFin": fecha_fin_obj.strftime("%Y-%m-%d"),
        "horaFin": fecha_fin_obj.strftime("%H:%M"),
    }
