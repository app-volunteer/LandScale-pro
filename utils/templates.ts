
import { collection, getDocs, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Template } from "../types";

// Default Templates
export const defaultTemplates: Template[] = [
  {
    id: "template_modern_executive",
    name: "Modern Executive",
    html: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <div style="background: #1e3a8a; padding: 40px 30px; color: white;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">OFFICIAL LAND SURVEY</h1>
    <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em;">Certificate of Measurement</p>
  </div>
  
  <div style="padding: 40px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
      <div>
        <label style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Owner Information</label>
        <div style="font-size: 18px; font-weight: 600; color: #1e293b; min-height: 24px; padding: 8px 12px; background: #f0f4f8; border-radius: 6px;">{{ownerName}}</div>
      </div>
      <div>
        <label style="display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Plot Registration</label>
        <div style="font-size: 18px; font-weight: 600; color: #1e293b; min-height: 24px; padding: 8px 12px; background: #f0f4f8; border-radius: 6px;">#{{plotNumber}}</div>
      </div>
    </div>

    <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">
        <span style="color: #64748b;">Total Area</span>
        <span style="font-size: 24px; font-weight: 800; color: #1e3a8a; min-height: 28px; padding: 4px 12px; background: #e0e7ff; border-radius: 6px;">{{area}} m²</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">
        <span style="color: #64748b;">Location</span>
        <span style="font-weight: 600; color: #334155; min-height: 20px; padding: 6px 12px; background: #f0f4f8; border-radius: 6px;">{{location}}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #64748b;">Survey Date</span>
        <span style="font-weight: 600; color: #334155; min-height: 20px; padding: 6px 12px; background: #f0f4f8; border-radius: 6px;">{{surveyDate}}</span>
      </div>
    </div>

    <div style="margin-bottom: 40px;">
      <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">Surveyor's Remarks</h3>
      <p style="color: #475569; line-height: 1.6; margin: 0; font-style: italic; min-height: 60px; padding: 12px; background: #f0f4f8; border-radius: 6px;">"{{notes}}"</p>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 60px;">
      <div style="text-align: center;">
        <div style="width: 200px; border-bottom: 1px solid #1e293b; margin-bottom: 8px;"></div>
        <div style="font-size: 12px; font-weight: 700; color: #1e293b; text-transform: uppercase;">Authorized Signature</div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Verified on {{surveyDate}}</div>
      </div>
    </div>
  </div>
</div>`,
  },
  {
    id: "template_blueprint",
    name: "Blueprint Engineering",
    html: `<div style="font-family: 'Courier New', Courier, monospace; background: #0f172a; color: #38bdf8; padding: 40px; border: 4px double #38bdf8; max-width: 800px; margin: 0 auto; box-sizing: border-box;">
  <div style="text-align: center; border-bottom: 2px solid #38bdf8; padding-bottom: 20px; margin-bottom: 30px;">
    <h2 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 4px;">Technical Specification</h2>
    <div style="font-size: 12px; margin-top: 5px;">GRID REFERENCE: SURVEY-REF-<span style="background: #1e293b; padding: 2px 8px; border-radius: 4px;">{{plotNumber}}</span></div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border: 1px solid #1e293b; padding: 20px; background: rgba(56, 189, 248, 0.05);">
    <div>
      <div style="font-size: 10px; color: #7dd3fc; margin-bottom: 2px;">[01] CLIENT NAME</div>
      <div style="font-size: 16px; font-weight: bold; color: #f0f9ff; text-transform: uppercase; min-height: 20px; padding: 6px 8px; background: rgba(30, 41, 59, 0.5); border-radius: 4px;">{{ownerName}}</div>
    </div>
    <div>
      <div style="font-size: 10px; color: #7dd3fc; margin-bottom: 2px;">[02] ASSET COORD</div>
      <div style="font-size: 16px; font-weight: bold; color: #f0f9ff; min-height: 20px; padding: 6px 8px; background: rgba(30, 41, 59, 0.5); border-radius: 4px;">{{location}}</div>
    </div>
    <div>
      <div style="font-size: 10px; color: #7dd3fc; margin-bottom: 2px;">[03] TOTAL MAGNITUDE</div>
      <div style="font-size: 20px; font-weight: bold; color: #38bdf8; min-height: 24px; padding: 4px 8px; background: rgba(30, 41, 59, 0.5); border-radius: 4px;">{{area}} M&sup2;</div>
    </div>
    <div>
      <div style="font-size: 10px; color: #7dd3fc; margin-bottom: 2px;">[04] TIMESTAMP</div>
      <div style="font-size: 16px; font-weight: bold; color: #f0f9ff; min-height: 20px; padding: 6px 8px; background: rgba(30, 41, 59, 0.5); border-radius: 4px;">{{surveyDate}}</div>
    </div>
  </div>

  <div style="margin-top: 30px; border-top: 1px dashed #38bdf8; padding-top: 20px;">
    <div style="font-size: 10px; color: #7dd3fc; margin-bottom: 10px;">[05] FIELD OBSERVATIONS</div>
    <div style="min-height: 100px; border: 1px solid #1e293b; padding: 15px; color: #bae6fd; font-size: 14px; line-height: 1.5; background: rgba(0,0,0,0.2); border-radius: 4px;">{{notes}}</div>
  </div>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
    <div style="font-size: 9px; color: #075985;">
      GEN-ID: {{plotNumber}}-{{surveyDate}}<br/>
      ALL MEASUREMENTS SUBJECT TO FIELD VERIFICATION
    </div>
    <div style="text-align: right;">
      <div style="font-size: 10px; margin-bottom: 30px;">AUTHENTICATED BY:</div>
      <div style="font-size: 12px; border-top: 1px solid #38bdf8; padding-top: 5px; min-width: 150px;">ENGINEERING DEPT</div>
    </div>
  </div>
</div>`,
  },
  {
    id: "template_luxury",
    name: "Luxury Estate",
    html: `<div style="font-family: 'Times New Roman', Times, serif; background: #fffcf2; color: #432818; padding: 50px; border: 15px solid #bb9457; max-width: 750px; margin: 0 auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="font-size: 42px; font-weight: normal; color: #99582a; margin: 0;">Estate Portfolio</div>
    <div style="width: 60px; height: 2px; background: #bb9457; margin: 15px auto;"></div>
    <div style="text-transform: uppercase; letter-spacing: 3px; font-size: 12px; color: #6f4e37;">Official Property Assessment</div>
  </div>

  <div style="border: 1px solid #e6ccb2; padding: 30px; margin-bottom: 30px; position: relative;">
    <div style="display: flex; margin-bottom: 25px;">
      <div style="flex: 1;">
        <div style="font-size: 11px; color: #99582a; text-transform: uppercase; margin-bottom: 5px;">Proprietor</div>
        <div style="font-size: 22px; color: #432818; min-height: 24px; padding: 8px 12px; background: #f5ede0; border-radius: 6px;">{{ownerName}}</div>
      </div>
      <div style="flex: 1; text-align: right;">
        <div style="font-size: 11px; color: #99582a; text-transform: uppercase; margin-bottom: 5px;">Reference No.</div>
        <div style="font-size: 22px; color: #432818; min-height: 24px; padding: 8px 12px; background: #f5ede0; border-radius: 6px;">{{plotNumber}}</div>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <div style="font-size: 11px; color: #99582a; text-transform: uppercase; margin-bottom: 5px;">Address & Location</div>
      <div style="font-size: 18px; color: #432818; min-height: 22px; padding: 8px 12px; background: #f5ede0; border-radius: 6px;">{{location}}</div>
    </div>

    <div style="display: flex; align-items: baseline; border-top: 1px solid #ede0d4; padding-top: 20px;">
      <div style="font-size: 14px; font-style: italic; color: #6f4e37;">Estimated Surface Area:</div>
      <div style="font-size: 32px; font-weight: bold; color: #99582a; margin-left: 15px; min-height: 32px; padding: 4px 12px; background: #f5ede0; border-radius: 6px;">{{area}} Square Meters</div>
    </div>
  </div>

  <div style="margin-bottom: 40px;">
    <div style="font-size: 11px; color: #99582a; text-transform: uppercase; margin-bottom: 10px;">Professional Notes</div>
    <div style="font-size: 15px; line-height: 1.8; color: #432818; padding: 20px; background: #f5ede0; border-radius: 6px; min-height: 80px;">{{notes}}</div>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
    <div style="font-size: 13px; color: #99582a;">
      DATED: <span style="padding: 4px 12px; background: #f5ede0; border-radius: 6px;">{{surveyDate}}</span>
    </div>
    <div style="text-align: center;">
      <div style="font-family: 'Brush Script MT', cursive; font-size: 28px; color: #432818; margin-bottom: -10px;">Official Seal</div>
      <div style="width: 150px; border-bottom: 1px solid #bb9457;"></div>
      <div style="font-size: 10px; margin-top: 5px; color: #6f4e37;">CERTIFIED ESTATE VALUER</div>
    </div>
  </div>
</div>`,
  },
];

export const initializeTemplates = async () => {
  try {
    const templatesRef = collection(db, "templates");
    const snapshot = await getDocs(templatesRef);
    if (snapshot.empty) {
      for (const t of defaultTemplates) {
        await setDoc(doc(templatesRef, t.id), {
          name: t.name,
          html: t.html,
          createdAt: serverTimestamp(),
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error initializing templates:", error);
    return false;
  }
};

export const fetchTemplates = async (): Promise<Template[]> => {
  try {
    const templatesRef = collection(db, "templates");
    const snapshot = await getDocs(templatesRef);
    const templates: Template[] = [];
    snapshot.forEach((docSnap) => {
      templates.push({
        id: docSnap.id,
        ...docSnap.data() as any,
      });
    });
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

export const saveProjectToFirestore = async (userId: string, data: any) => {
  try {
    const projectRef = doc(collection(db, "users", userId, "projects"));
    await setDoc(projectRef, {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error saving project:", error);
    return false;
  }
};
