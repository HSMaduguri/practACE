import json
import os

# Create python script to generate caseScenariosFR.ts with all 68 Case Scenarios from the ICAI Booklet

def build_script():
    with open('/src/data/caseScenariosFR.ts', 'w', encoding='utf-8') as f:
        f.write('''/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CA Final Financial Reporting (FR) - ICAI Booklet on Case Scenarios (All 68 Case Scenarios)
 */

import { CaseScenario } from '../types';

export const CASE_SCENARIOS_FR: CaseScenario[] = [
''')

build_script()
print("Initialized generator script.")
