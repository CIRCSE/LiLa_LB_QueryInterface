export const listOfPrefix = [
    {prefix: "lilaLemma:" ,uri:"http://lila-erc.eu/data/id/lemma/"},
    {prefix: "lilaIpoLemma:" ,uri:"http://lila-erc.eu/data/id/hypolemma/"},
    {prefix: "lila:" ,uri:"http://lila-erc.eu/ontologies/lila/"},
    {prefix: "ontolex:" ,uri:"http://www.w3.org/ns/lemon/ontolex#"},
    {prefix: "rdf:" ,uri:"http://www.w3.org/1999/02/22-rdf-syntax-ns#"},
    {prefix: "rdfs:" ,uri:"http://www.w3.org/2000/01/rdf-schema#"},
]

export function translatePrefix(String){
    let out = String
    listOfPrefix.forEach(object => {
        if (String.startsWith(object.prefix)){
            out = String.replace(object.prefix,object.uri)

        }else if(String.startsWith(object.uri)){
            out = String.replace(object.uri,object.prefix)
        }
    })
    return out
}


export function getLatinAffectusPolarity(lexicon,subject){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX marl: <http://www.gsi.dit.upm.es/ontologies/marl/ns#>\n" +
        "\n" +
        "SELECT ?polarityValue ?polarity WHERE {\n" +
        " ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le . \n" +
        "\t?le ontolex:sense ?sense .\n" +
        "  \t?sense marl:polarityValue ?polarityValue;\n" +
        "          marl:hasPolarity ?polarityObj.\n" +
        "  \t?polarityObj rdfs:label ?polarity\n" +
        "} "
}


export function getWflQuery(lexicon,subject){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lemonVartrans: <http://www.w3.org/ns/lemon/vartrans#>\n" +
        "PREFIX wfl: <http://lila-erc.eu/ontologies/lila/wfl/>\n" +
        "\n" +
        "  \n" +
        "SELECT * WHERE {\n" +
        "    ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le . \n" +
        "   # optional{\n" +
        "\t?wflsourceRel lemonVartrans:source|lemonVartrans:target ?le;\n" +
        "                  wfl:hasWordFormationRule ?rule ;\n" +
        "                  lemonVartrans:target ?le2 ;\n" +
        "                  lemonVartrans:source ?le3 .\n" +
        "    ?le2 ontolex:canonicalForm ?lemma2 .\n" +
        "    ?le3 ontolex:canonicalForm ?lemma3 .\n" +
        "  \t?le  ontolex:canonicalForm ?lemma .\n" +
        "  \t?rule rdfs:label ?ruleLabel; \n" +
        "          rdf:type ?ruleType .\n" +
        "\n" +
        " # } \n" +
        " optional {\n" +
        "  \t\t?rule wfl:involves ?involve .\n" +
        "    SERVICE <https://lila-erc.eu/sparql/lemmaBank/query> {\n" +
        "      ?involve rdfs:label ?affixPrefixLabel\n" +
        "    }\n" +
        "    \n" +
        "  }\n" +
        "  \n" +
        "  optional {\n" +
        "  \t\t?relation2 wfl:hasWordFormationRule ?rule ; \n" +
        "               \t   lemonVartrans:source ?deriv .\n" +
        "     \tFILTER ( ?le != ?deriv )\n" +
        "    \t?deriv ontolex:canonicalForm ?derivLemma.\n" +
        "  \tSERVICE <https://lila-erc.eu/sparql/lemmaBank/query> {\n" +
        "      ?derivLemma rdfs:label ?derivLemmaLabel.\n" +
        "    }\n" +
        "  }\n" +
        "\tSERVICE <https://lila-erc.eu/sparql/lemmaBank/query> {\n" +
        " \t ?lemma rdfs:label ?lemmaLabel.\n" +
        "    ?lemma2 rdfs:label ?lemmaLabel2.\n" +
        "    ?lemma3 rdfs:label ?lemmaLabel3.\n" +
        "    \n" +
        "  }\n" +
        "    \n" +
        "} \n" +
        "  "
}


export function getEtymonQuery(lexicon,subject){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX lemonEty: <http://lari-datasets.ilc.cnr.it/lemonEty#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lilaLemma: <http://lila-erc.eu/data/id/lemma/>\n" +
        "PREFIX lilaIpoLemma: <http://lila-erc.eu/data/id/hypolemma/>\n" +
        "\n" +
        "SELECT  ?etymon ?etymonLanguage ?cognateLemma WHERE {\n" +
        " ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le" +
        "\t{?le lemonEty:etymology ?etymology .\n" +
        "  \t?etymology lemonEty:etymon ?ety.\n" +
        "  \t?ety lime:language ?etymonLanguage;\n" +
        "        rdfs:label ?etymon.}\n" +
        "  \tUNION{\n" +
        "      ?le lemonEty:cognate ?cognate .\n" +
        "      ?cognate lemonEty:etymology ?etymologyCog .\n" +
        "\t  ?cognate ontolex:canonicalForm ?cognateLemma .   \n" +
        "      ?etymologyCog lemonEty:etymon ?etyCog .\n" +
        "      ?etyCog lime:language ?etymonLanguage;\n" +
        "                 rdfs:label ?etymon.\n" +
        "  \t}\n" +
        "} "
}

export function getLatinWordnetQueryOld (lexicon,subject){
    return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "\n" +
        "SELECT *\n" +
        "{\n" +
        " ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le . \n" +
        "\t?le ontolex:sense ?sense.\n" +
        "  \t?sense ontolex:isLexicalizedSenseOf ?synLink.\n" +
        "    ?synLink skos:definition ?def.\n" +
        "  \tOPTIONAL {\n" +
        "      ?pT rdfs:subPropertyOf wn:link .\n" +
        "      ?pT rdfs:label ?pTLabel.\n" +
        "      ?synLink ?pT ?relSyn.\n" +
        "      ?relSyn skos:definition ?defRel.\n" +
        "  \t}\n" +
        "}"
}

export function getLatinWordnetQuery (lexicon,subject){
    return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos/core#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "prefix premon: <http://premon.fbk.eu/ontology/core#>\n" +
        "prefix lv: <http://lila-erc.eu/ontologies/latinVallex/>\n" +
        "\n" +
        "SELECT ?le ?sense ?synLink  ?def  (GROUP_CONCAT(DISTINCT ?funcLabel ; separator=\" \") as ?func)\n" +
        "{\n" +
        " ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le . \n" +
        "\t?le ontolex:sense ?sense.\n" +
        "  \t?sense ontolex:isLexicalizedSenseOf ?synLink.\n" +
        "    ?synLink skos:definition ?def.\n" +
        "  \tOPTIONAL {\n" +
        "      ?pT rdfs:subPropertyOf wn:link .\n" +
        "      ?pT rdfs:label ?pTLabel.\n" +
        "      ?synLink ?pT ?relSyn.\n" +
        "      ?relSyn skos:definition ?defRel.\n" +
        "  \t}\n" +
        "    optional{\n" +
        "         ?WNConc premon:evokedConcept ?synLink .\n" +
        "    \t ?mapVWN premon:item ?Vconc;\n" +
        "                 premon:item ?WNConc .\n" +
        "         ?Vconc premon:evokedConcept ?frame.\n" +
        "    \t ?le ontolex:evokes ?frame .\n" +
        "  \t\t ?frame premon:semRole ?fs .\n" +
        "    \t ?fs lv:functor ?functors . \n" +
        "    \t ?functors rdfs:label ?funcLabel\n" +
        "    } \n" +
        "}group by ?le ?sense ?synLink ?def "
}


export function getIGVLLQuery(lexicon,subject){
    return "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "PREFIX ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "PREFIX lemonEty: <http://lari-datasets.ilc.cnr.it/lemonEty#>\n" +
        "PREFIX crminf: <http://new.cidoc-crm.org/crminf/>\n" +
        "SELECT ?etymology ?belief ?etymo ?cognate (GROUP_CONCAT(DISTINCT ?subtermsLabel ; separator=\" \") as ?subterms)  WHERE {\n" +
        " ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  \t<"+lexicon+"> lime:entry ?le . \n" +
        "\t?le lemonEty:etymology ?etymology .\n" +
        "  \t?etymology lemonEty:etymon ?etymon .\n" +
        "  OPTIONAL {\n" +
        "  \t?beliefcrm crminf:J4 ?etymology;\n" +
        "           rdfs:label ?belief.\n" +
        "  }\n" +
        "  \t?etymon rdfs:label ?etymo.\n" +
        "  OPTIONAL {\n" +
        "    ?etymon lemonEty:cognate ?cogn.\n" +
        "    ?cogn rdfs:label ?cognate\n" +
        "  }\n" +
        "  OPTIONAL{\n" +
        "  \t?etymon <decomp:subterm> ?subs.\n" +
        "    ?subs rdfs:label ?subtermsLabel\n" +
        "  }\n" +
        "  \n" +
        "}group by ?etymology ?belief ?etymo ?cognate\n" +
        "\n" +
        "\n"
}


export function getLewisShortQuery (lexicon,subject){
    return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "prefix premon: <http://premon.fbk.eu/ontology/core#>\n" +
        "prefix lv: <http://lila-erc.eu/ontologies/latinVallex/>\n" +
        "\n" +
        "SELECT *\n" +
        "{\n" +
        " ?le ontolex:canonicalForm <"+ subject +"> .\n" +
        "  \t <" + lexicon + "> lime:entry ?le .\n" +
        " ?le rdfs:label ?leLabel .\n" +
        "  \n" +
        " \t\t?le    ontolex:evokes ?defs.\n" +
        "  \t\t?defs skos:definition ?defsString  .\n" +
        "}order by ?defs"
}