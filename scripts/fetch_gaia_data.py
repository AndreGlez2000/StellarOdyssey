# fetch_gaia_data.py
from astroquery.gaia import Gaia
import pandas as pd

# Definir la consulta SQL para obtener datos estelares del Gaia Archive
query = """
SELECT TOP 1000
  source_id, ra, dec, parallax, phot_g_mean_mag
FROM gaiadr3.gaia_source
WHERE phot_g_mean_mag < 6.5
"""

# Ejecutar la consulta
job = Gaia.launch_job(query)
results = job.get_results()

# Convertir los resultados a un DataFrame de pandas
df = results.to_pandas()

# Guardar los resultados en un archivo CSV
df.to_csv("data/gaia_stars.csv", index=False)

print("Datos estelares guardados en 'data/gaia_stars.csv'")
