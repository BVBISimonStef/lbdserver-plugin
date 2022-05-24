import React, { useState } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { useRecoilState } from "recoil";
import { project as p } from "../../../atoms";
import { v4 } from "uuid";
import { LbdProject, LbdService } from "lbdserver-client-api";
import { RDFS } from "@inrupt/vocab-common-rdf";
import { useNavigate } from "react-router-dom";

export default function CreateProject(props) {
  const { open, title, description, Child, childProps } = props;
  const [project, setProject] = useRecoilState(p);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState(v4());
  const [foutmelding, setFoutmelding] = useState(true);
  let navigate = useNavigate();

  async function createProject() {
    try {
      setLoading(true);
      const myService = new LbdService(getDefaultSession());
      let aggregator = await myService.getProjectRegistry(
        getDefaultSession().info.webId
      );
      if (!aggregator) aggregator = await myService.createProjectRegistry();
      console.log("aggregator", aggregator);
      const accessPoint = aggregator + id;
      const myProject = new LbdProject(getDefaultSession(), accessPoint);
      if (
        year === "" ||
        name === "" ||
        country === "" ||
        city === "" ||
        status === "" ||
        role === ""
      ) {
        setError(true);
        setLoading(false);
        setFoutmelding("");
      } else {
        await myProject.create(
          [],
          {
            [RDFS.label]: name,
            "http://www.w3.org/2006/time#year": year,
            "http://dbpedia.org/ontology/country": country,
            "http://dbpedia.org/ontology/city": city,
            "http://dbpedia.org/ontology/currentStatus": status,
            "http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#Role": role,
            "http://id": id,
          },
          true
        );
        setSuccess(true);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div>
      <Typography variant="h5">{title}</Typography>
      <Typography>{description}</Typography>
      {getDefaultSession().info.isLoggedIn ? (
        <div style={{ marginTop: 30 }}>
          <br />
          <TextField
            id="projectName"
            label="Project Name"
            placeholder="Project Name"
            fullWidth
            sx={{ mb: "2%" }}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && name === ""}
            helperText={
              foutmelding === "" && name === "" ? "Empty field!" : " "
            }
          />
          <TextField
            id="projectId"
            label="Project ID"
            placeholder="Project ID"
            defaultValue={id}
            fullWidth
            sx={{ mb: "2%" }}
            onChange={(e) => setId(e.target.value)}
            autoFocus
            disabled={loading}
          />
          <TextField
            id="country"
            label="Country"
            placeholder="Country"
            style={{ width: "49%" }}
            sx={{ mr: "2%", mb: "2%" }}
            onChange={(e) => setCountry(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && country === ""}
            helperText={
              foutmelding === "" && country === "" ? "Empty field!" : " "
            }
          />
          <TextField
            id="city"
            label="City"
            placeholder="City"
            style={{ width: "49%", mb: "2%" }}
            onChange={(e) => setCity(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && city === ""}
            helperText={
              foutmelding === "" && city === "" ? "Empty field!" : " "
            }
          />
          <TextField
            id="status"
            label="Status"
            placeholder="Status"
            style={{ width: "69%" }}
            sx={{ mr: "2%", mb: "2%" }}
            onChange={(e) => setStatus(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && status === ""}
            helperText={
              foutmelding === "" && status === "" ? "Empty field!" : " "
            }
          />
          <TextField
            id="projectYear"
            label="Project Year"
            placeholder="Project Year"
            style={{ width: "29%" }}
            sx={{ mb: "2%" }}
            onChange={(e) => setYear(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && year === ""}
            helperText={
              foutmelding === "" && year === "" ? "Empty field!" : " "
            }
          />
          <TextField
            id="role"
            label="Role"
            placeholder="Role"
            fullWidth
            sx={{ mb: "2%" }}
            onChange={(e) => setRole(e.target.value)}
            autoFocus
            disabled={loading}
            error={foutmelding === "" && role === ""}
            helperText={
              foutmelding === "" && role === "" ? "Empty field!" : " "
            }
          />

          {error ? (
            <Alert onClose={() => setError(null)} severity="error">
              Fill in all fields!
            </Alert>
          ) : (
            <React.Fragment />
          )}
          {success ? (
            <Alert onClose={() => setSuccess(null)} severity="success">
              Your project was successfully created and is now the Active
              Project
            </Alert>
          ) : (
            <React.Fragment />
          )}
          <Button
            style={{ marginTop: 10, width: "200" }}
            variant="contained"
            onClick={createProject}
          >
            Create Project
          </Button>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <Typography>
            You are not authenticated. Login to create a project.
          </Typography>
        </div>
      )}
    </div>
  );
}
