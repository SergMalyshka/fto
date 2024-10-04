import Auth from "../utils/auth"
import { QUERY_ALL_OPEN_VISITS} from "../utils/queries";
import { useQuery } from "@apollo/client";
import { DndContext, PointerSensor, closestCorners, useSensor } from "@dnd-kit/core"
import style from './Dashboard.module.css'
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { VisitWrapper } from "../components/VisitWrapper/VisitWrapper";
import LoginPrompt from "../components/LoginPrompt/LoginPrompt";

export default function test() {

  const { loading, data } = useQuery(QUERY_ALL_OPEN_VISITS, { fetchPolicy: "network-only" })

  return (
    <div>
      {Auth.loggedIn() ? (
        <div className={style.dashboard}>
          
          {loading ? (
            <div>Loading...</div>
          ) : (
                <VisitWrapper visits={data.openVisits} />
          )}
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  )
}