import { router } from "expo-router";
import { FlatList, Text, TouchableOpacity } from "react-native";

const mockarro = [
  { first_name: "Cassandre" }, { first_name: "Paco" }, { first_name: "Mehetabel" },
  { first_name: "Oralle" }, { first_name: "Glendon" }, { first_name: "Lyman" },
  { first_name: "Jacinda" }, { first_name: "Milicent" }, { first_name: "Wain" },
  { first_name: "Mead" }, { first_name: "Cirillo" }, { first_name: "Bradney" },
  { first_name: "Brandtr" }, { first_name: "Maggee" }, { first_name: "Rhianna" },
  { first_name: "Sophia" }, { first_name: "Bridie" }, { first_name: "Dedie" },
  { first_name: "Fredrika" }, { first_name: "Brita" }, { first_name: "Ross" },
  { first_name: "Maury" }, { first_name: "Siward" }, { first_name: "Moreen" },
  { first_name: "Hyacinthie" }, { first_name: "Jefferey" }, { first_name: "Bianca" },
  { first_name: "Mae" }, { first_name: "Ennis" }, { first_name: "Ede" },
  { first_name: "Webster" }, { first_name: "Lester" }, { first_name: "Arleta" },
  { first_name: "Dacey" }, { first_name: "Tamas" }, { first_name: "Josephine" },
  { first_name: "Panchito" },
];

const drug= [{
  drug: "MEIJER, INC."
}, {
  drug: "Parfums Christian Dior"
}, {
  drug: "State of Florida DOH Central Pharmacy"
}, {
  drug: "Tropical Seas, Inc."
}, {
  drug: "Yves Rocher North America Inc. DBA Laboratoire de biologie vegetal Yves Rocher"
}, {
  drug: "Uriel Pharmacy Inc."
}, {
  drug: "PD-Rx Pharmaceuticals, Inc."
}, {
  drug: "Ista Pharmaceuticals, Inc"
}, {
  drug: "New World Imports, Inc"
}, {
  drug: "Natural Health Supply"
}, {
  drug: "ENCHANTE ACCESSORIES INC."
}, {
  drug: "C.B. Fleet Company, Inc."
}, {
  drug: "Rebel Distributors Corp"
}, {
  drug: "Fresh, Inc."
}, {
  drug: "REMEDYREPACK INC."
}, {
  drug: "Newton Laboratories, Inc."
}, {
  drug: "American Health Packaging"
}, {
  drug: "Actavis Elizabeth LLC"
}, {
  drug: "Taro Pharmaceuticals U.S.A., Inc."
}, {
  drug: "American Health Packaging"
}, {
  drug: "Galderma Laboratories, L.P."
}, {
  drug: "Quinnova Pharmaceuticals, LLC"
}, {
  drug: "Kmart Corporation"
}, {
  drug: "Ben E. Keith"
}, {
  drug: "Physicians Total Care, Inc."
}, {
  drug: "TYA Pharmaceuticals"
}, {
  drug: "Deb USA, Inc."
}, {
  drug: "Walgreen Company"
}, {
  drug: "Pure Source Inc."
}, {
  drug: "NCS HealthCare of KY, Inc dba Vangard Labs"
}, {
  drug: "Genentech, Inc."
}, {
  drug: "Acorda Therapeutics, Inc."
}, {
  drug: "Uriel Pharmacy Inc."
}, {
  drug: "MSD Consumer Care, Inc."
}, {
  drug: "bryant ranch prepack"
}, {
  drug: "Cardinal Health"
}, {
  drug: "Woodbine Products Company"
}, {
  drug: "Shanghai Yinjing Medical Supplies Co., Ltd."
}, {
  drug: "SHISEIDO CO., LTD."
}, {
  drug: "Remedy Makers"
}, {
  drug: "West-ward Pharmaceutical Corp"
}, {
  drug: "Natural Health Supply"
}, {
  drug: "Lead Chemical Co. Ltd."
}, {
  drug: "Cardinal Health"
}, {
  drug: "Two Hip Consulting, LLC"
}, {
  drug: "Hospira, Inc."
}, {
  drug: "SHISEIDO AMERICA INC."
}, {
  drug: "Golden State Medical Supply, Inc."
}, {
  drug: "Paddock Laboratories, LLC"
}, {
  drug: "Trigen Laboratories, Inc."
}, {
  drug: "RFX Pharmaceutical Co., Ltd."
}, {
  drug: "Baxter Healthcare Corporation"
}, {
  drug: "Glenmark Generics Inc., USA"
}, {
  drug: "Teva Pharmaceuticals USA Inc"
}, {
  drug: "H E B"
}, {
  drug: "Prestige Brands Holdings, Inc."
}, {
  drug: "REMEDYREPACK INC."
}, {
  drug: "Cephalon, Inc."
}, {
  drug: "Exelan Pharmaceuticals, Inc."
}, {
  drug: "ALK-Abello, Inc."
}, {
  drug: "Novo Nordisk"
}, {
  drug: "P and L Development of New York Corporation (ReadyInCase)"
}, {
  drug: "Blenheim Pharmacal, Inc."
}, {
  drug: "Amerisource Bergen"
}, {
  drug: "Rite Aid"
}, {
  drug: "Lupin Pharmaceuticals, Inc."
}, {
  drug: "Taro Pharmaceuticals U.S.A., Inc."
}, {
  drug: "Bryant Ranch Prepack"
}, {
  drug: "Sato Pharmaceutical Co., Ltd."
}, {
  drug: "Hospira, Inc."
}, {
  drug: "Teva Parenteral Medicines, Inc."
}, {
  drug: "Cardinal Health"
}, {
  drug: "Pfizer Laboratories Div Pfizer Inc."
}, {
  drug: "Teva Pharmaceuticals USA Inc"
}, {
  drug: "American Sales"
}, {
  drug: "Teva Pharmaceuticals USA Inc"
}, {
  drug: "Par Pharmaceutical Inc."
}, {
  drug: "Cardinal Health"
}, {
  drug: "Medline Industries, Inc."
}, {
  drug: "Mutual Pharmaceutical Company, Inc."
}, {
  drug: "MSD Consumer Care, Inc."
}, {
  drug: "Hospira, Inc."
}, {
  drug: "CHANEL PARFUMS BEAUTE"
}, {
  drug: "Eon Labs, Inc."
}, {
  drug: "Uriel Pharmacy Inc."
}, {
  drug: "Apotheca Company"
}, {
  drug: "Physicians Total Care, Inc."
}, {
  drug: "Western Family Foods Inc"
}, {
  drug: "Uriel Pharmacy Inc."
}, {
  drug: "Allergy Laboratories, Inc."
}, {
  drug: "Praxair Distribution, Inc."
}, {
  drug: "Everett Laboratories, Inc."
}, {
  drug: "Plaza Home Care, Inc."
}, {
  drug: "Mutual Pharmaceutical Company, Inc."
}, {
  drug: "Nexgen Pharma, Inc."
}, {
  drug: "Amway Corp"
}, {
  drug: "Nelco Laboratories, Inc."
}, {
  drug: "NARS COSMETICS"
}, {
  drug: "Medline Industries, Inc."
}, {
  drug: "Perrigo New York Inc"
  }] 

const data = mockarro.map((item, index) => ({
  name: item.first_name,
  drug: drug[index]?.drug ?? "N/A",
}))


export default function TesteScreen() {
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: "darkblue" }}
      data={data}
      keyExtractor={(item, index) => item.name + index}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "white" }}
          onPress={() => router.push({ pathname: "/teste/detalhe", params: { name: item.name, drug: item.drug } })}
        >
          <Text style={{ textAlign: "center", color: "white" }}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

