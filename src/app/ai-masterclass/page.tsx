import MasterclassPage from "@/components/masterclass/MasterclassPage";

export default function AiMasterclassRoute() {
  return <MasterclassPage metrikaId={process.env.YANDEX_METRIKA_ID} />;
}
