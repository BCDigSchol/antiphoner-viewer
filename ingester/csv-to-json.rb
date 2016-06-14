require 'csv'
require 'json'

antiphoner = {
    'Front cover' => [],
    'Front endpaper' => []
}
current_folio = ''
chants = []

CSV.foreach('inventory.csv', :headers => true) do |row|
  if current_folio == ''
    current_folio = row['Folio']
    chants = []
  elsif current_folio != row['Folio']
    antiphoner[current_folio.sub(/^0+/,'')] = chants
    current_folio = row['Folio']
    chants = []
  end

  chant = {}
  chant[:id] = current_folio + row['Sequence']
  chant[:sequence] = row['Sequence']
  chant[:incipit] = row['Incipit']
  chant[:feast] = row['Feast']
  chant[:office] = row['Office']
  chant[:genre] = row['Genre']
  chant[:position] = row['Position']
  chant[:cantus_id] = row['Cantus ID']
  chant[:mode] = row['Mode']
  chant[:differentia] = row['Differentia']
  chant[:full_text_standard] = row['Full text (standardized)']
  chant[:volpiano] = row['Volpiano']

  search_volpiano = ''

  if chant[:volpiano]
    search_volpiano = chant[:volpiano].gsub(/[\W\d]/,'')
  end

  chant[:search_volpiano] = search_volpiano

  chant_id = current_folio + chant[:sequence]

  chants.push(chant)
end

antiphoner[current_folio] = chants
antiphoner['Back endpaper'] = []

File.open("antiphoner-data.json", "w") do |f|
  f.write(JSON.dump(antiphoner))
end