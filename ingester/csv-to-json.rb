require 'csv'
require 'json'

genre_map = {
    'A' => 'Antiphon',
    'Ag' => 'Agnus dei',
    'Al' => 'Alleluia',
    'AlV' => 'Alleluia verse',
    'AV' => 'Antiphon verse',
    'BD' => 'Benedicamus domino',
    'Ca' => 'Cantica',
    'Cap' => 'Capitulum',
    'CaV' => 'Cantica verse',
    'Cm' => 'Communion',
    'CmR' => 'Versus ad repetendum for the communion',
    'CmV' => 'Communion verse',
    'Cr' => 'Credo',
    'D' => 'Dramatic element (used for items of liturgical drama that are not otherwise rubricked)',
    'Gl' => 'Gloria',
    'Gp/Ep' => 'Gospel/Epistle',
    'Gr' => 'Gradual',
    'GrV' => 'Gradual verse',
    'H' => 'Hymn',
    'HV' => 'Hymn verse',
    'I' => 'Invitatory antiphon',
    'Ig' => 'Ingressa (for the Beneventan liturgy)',
    'In' => 'Introit',
    'InR' => 'Versus ad repetendum for the introit',
    'InV' => 'Introit verse',
    'IP' => 'Invitatory psalm (when fully written out and notated)',
    'Ite' => 'Ite missa est',
    'Ky' => 'Kyrie',
    'L' => 'Lesson (when fully written out and notated)',
    'Li' => 'Litany',
    'LiV' => 'Litany verse',
    'Of' => 'Offertory',
    'OfV' => 'Offertory verse',
    'Pr' => 'Prefatio (when written out and notated)',
    'PS' => 'Psalm',
    'R' => 'Responsory',
    'Sa' => 'Sanctus',
    'Sq' => 'Sequence',
    'SqV' => 'Sequence verse',
    'Tc' => 'Tract',
    'TcV' => 'Tract verse',
    'Tp' => 'Tropus',
    'V' => 'Responsory verse',
    'Va' => 'Varia',
    'VaHW' => 'Varia within Holy Week',
    'W' => 'Versicle',
    '[?]' => 'Unknown, ambiguous, unidentifiable, illegible',
    '[GV]' => 'Verse for a Mass chant (a generic code used in the earliest Cantus indices)',
    '[G]' => 'Mass chant (a generic code used in the earliest Cantus indices)',
    '[MO]' => 'Mass Ordinary  (a generic code used in the earliest Cantus indices)',
    '[M]' => 'Miscellaneous (a descriptor used in the earliest versions of Cantus for the Te Deum, Versus in Triduo, prosulae - to be replaced by Va=Varia)'
}

office_map = {
    'V' => 'First Vespers',
    'C' => 'Compline ',
    'M' => 'Matins ',
    'L' => 'Lauds ',
    'P' => 'Prime ',
    'T' => 'Terce ',
    'S' => 'Sext ',
    'N' => 'None ',
    'V2' => 'Second Vespers',
    'MI' => 'Mass ',
    'MI1' => 'first Mass',
    'MI2' => 'second Mass',
    'MI3' => 'third Mass'
}

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
    antiphoner[current_folio.sub(/^0+/, '')] = chants
    current_folio = row['Folio']
    chants = []
  end

  chant = {}
  chant[:id] = current_folio + row['Sequence']
  chant[:folio] = current_folio
  chant[:sequence] = row['Sequence']
  chant[:incipit] = row['Incipit']
  chant[:feast] = row['Feast']
  chant[:office] = office_map[row['Office']]
  chant[:genre] = genre_map[row['Genre']]
  chant[:position] = row['Position']
  chant[:cantus_id] = row['Cantus ID']
  chant[:mode] = row['Mode']
  chant[:differentia] = row['Differentia']
  chant[:full_text_standard] = row['Full text (standardized)']
  chant[:volpiano] = row['Volpiano']

  search_volpiano = ''

  if chant[:volpiano]
    search_volpiano = chant[:volpiano].gsub(/[\W\d]/, '')
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