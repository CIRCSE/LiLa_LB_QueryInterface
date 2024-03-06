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
    console.log("PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
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
        "} ");
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
        "SELECT * WHERE {\n" +
        "  ?le ontolex:canonicalForm <"+subject+"> .\n" +
        "  <"+lexicon+"> lime:entry ?le .\n" +
        "  ?wflsourceRel lemonVartrans:source|lemonVartrans:target ?le;\n" +
        "                wfl:hasWordFormationRule ?rule ;\n" +
        "                lemonVartrans:target ?le2 ;\n" +
        "                lemonVartrans:source ?le3 .\n" +
        "  ?le2 ontolex:canonicalForm ?lemma2 .\n" +
        "  ?le3 ontolex:canonicalForm ?lemma3 .\n" +
        "  ?le  ontolex:canonicalForm ?lemma .\n" +
        "  ?rule rdfs:label ?ruleLabel;\n" +
        "        rdf:type ?ruleType .\n" +
        "  optional {\n" +
        "    ?rule wfl:involves ?involve .\n" +
        "    ?involve rdfs:label ?affixPrefixLabel\n" +
        "  }\n" +
        "  optional {\n" +
        "    ?relation2 wfl:hasWordFormationRule ?rule ;\n" +
        "               lemonVartrans:source ?deriv .\n" +
        "    FILTER ( ?le != ?deriv )\n" +
        "    ?deriv ontolex:canonicalForm ?derivLemma.\n" +
        "    ?derivLemma rdfs:label ?derivLemmaLabel.\n" +
        "  }\n" +
        "  ?lemma rdfs:label ?lemmaLabel.\n" +
        "  ?lemma2 rdfs:label ?lemmaLabel2.\n" +
        "  ?lemma3 rdfs:label ?lemmaLabel3.\n" +
        "}"
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


// export function getLewisShortQuery (lexicon,subject){
//     return "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
//         "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
//         "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
//         "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
//         "prefix skos: <http://www.w3.org/2004/02/skos#>\n" +
//         "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
//         "prefix premon: <http://premon.fbk.eu/ontology/core#>\n" +
//         "prefix lv: <http://lila-erc.eu/ontologies/latinVallex/>\n" +
//         "\n" +
//         "SELECT *\n" +
//         "{\n" +
//         " ?le ontolex:canonicalForm <"+ subject +"> .\n" +
//         "  \t <" + lexicon + "> lime:entry ?le .\n" +
//         " ?le rdfs:label ?leLabel .\n" +
//         "  \n" +
//         " \t\t?le    ontolex:evokes ?defs.\n" +
//         "  \t\t?defs skos:definition ?defsString  .\n" +
//         "}order by ?defs"
// }

export function getLewisShortQuery (lexicon,subject){
    return "PREFIX lexicog: <http://www.w3.org/ns/lemon/lexicog#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX lime: <http://www.w3.org/ns/lemon/lime#>\n" +
        "prefix ontolex: <http://www.w3.org/ns/lemon/ontolex#>\n" +
        "prefix skos: <http://www.w3.org/2004/02/skos#>\n" +
        "prefix wn: <http://wordnet-rdf.princeton.edu/ontology#>\n" +
        "prefix premon: <http://premon.fbk.eu/ontology/core#>\n" +
        "prefix lv: <http://lila-erc.eu/ontologies/latinVallex/>\n" +
        "SELECT *\n" +
        "{\n" +
        "  ?le ontolex:canonicalForm <"+ subject +"> .\n" +
        "  <" + lexicon + "> lime:entry ?le .\n" +
        "  ?le rdfs:label ?leLabel .\n" +
        "  ?lce lexicog:describes ?le\n" +
        "  optional{\n" +
        "    ?lce rdfs:seeAlso ?seeAlsoLCE .\n" +
        "    ?seeAlsoLCE lexicog:describes ?leSeeAlso.\n" +
        "    ?leSeeAlso ontolex:canonicalForm ?seeAlsoLemma.\n" +
        "    ?seeAlsoLemma rdfs:label ?seeAlsoLemmaLabel.\n" +
        "  }\n" +
        "  optional {\n" +
        "    ?le    ontolex:sense ?defs.\n" +
        "    ?defs skos:definition ?defsString.\n" +
        "  }\n" +
        "}order by ?defs"
}
