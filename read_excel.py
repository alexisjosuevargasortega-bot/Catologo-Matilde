import pandas as pd
import json

df = pd.read_excel('Catalogo_Servicios_Matilde360_excel_profesional.xlsx')
print(df.to_json(orient='records', force_ascii=False))
